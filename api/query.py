from http.server import BaseHTTPRequestHandler
import json
import os
import pickle
import time
from pathlib import Path

import pandas as pd
from google import genai
from rank_bm25 import BM25Okapi


ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT = ROOT / "backend" / "pipeline" / "retrieval_checkpoint"

_bm25 = None
_corpus = None


def load_retrieval():
    global _bm25, _corpus

    if _bm25 is not None and _corpus is not None:
        return

    with open(CHECKPOINT / "bm25_index.pkl", "rb") as f:
        _bm25 = pickle.load(f)

    _corpus = pd.read_parquet(CHECKPOINT / "sentence_corpus.parquet")


def retrieve(query, top_k=5):
    load_retrieval()

    tokens = query.lower().split()
    scores = _bm25.get_scores(tokens)

    ranked = sorted(
        enumerate(scores),
        key=lambda item: item[1],
        reverse=True,
    )[:top_k]

    evidence = []

    for index, score in ranked:
        row = _corpus.iloc[index].to_dict()

        # MSMARCO-XI corpus stores passages in passage_en / passage_hi.
        # Prefer Hindi evidence when the query contains Devanagari;
        # otherwise use the English passage.
        has_hindi = any(
            "\u0900" <= char <= "\u097F"
            for char in query
        )

        passage_key = "passage_hi" if has_hindi else "passage_en"
        passage = str(row.get(passage_key, "") or "")

        if not passage:
            fallback_key = "passage_en" if passage_key == "passage_hi" else "passage_hi"
            passage = str(row.get(fallback_key, "") or "")

        if passage:
            evidence.append({
                "rank": len(evidence) + 1,
                "score": float(score),
                "passage": passage,
            })

    return evidence


def generate_answer(query, evidence):
    if not evidence or evidence[0]["score"] <= 0:
        return None, False, "INSUFFICIENT_EVIDENCE", None

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return None, False, "GEMINI_API_KEY_NOT_CONFIGURED", None

    context = "\n\n".join(
        f"[Evidence {item['rank']}]\n{item['passage']}"
        for item in evidence
    )

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are VaaniRAG, a grounded retrieval assistant.

Answer ONLY from the evidence provided below.

If the evidence is insufficient, say so.
Never invent facts or use outside knowledge.

Question:
{query}

Evidence:
{context}

Give a concise grounded answer.
"""

    started = time.perf_counter()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    generation_ms = (time.perf_counter() - started) * 1000

    answer = (response.text or "").strip()

    if not answer:
        return None, False, "EMPTY_GENERATION", generation_ms

    return answer, True, "EVIDENCE_SUFFICIENT", generation_ms


class handler(BaseHTTPRequestHandler):

    def _send(self, status, body):
        data = json.dumps(
            body,
            ensure_ascii=False,
        ).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_POST(self):
        if self.path != "/api/query":
            self._send(404, {"detail": "Not found"})
            return

        started = time.perf_counter()

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length)
            payload = json.loads(raw.decode("utf-8"))

            query = str(payload.get("query", "")).strip()

            if not query:
                self._send(400, {"detail": "Query is required"})
                return

            if len(query) > 500:
                self._send(
                    400,
                    {"detail": "Query exceeds 500 characters"},
                )
                return

            top_k = min(
                max(int(payload.get("topK") or 5), 1),
                20,
            )

            retrieval_started = time.perf_counter()
            evidence = retrieve(query, top_k)
            retrieval_ms = (
                time.perf_counter() - retrieval_started
            ) * 1000

            answer, grounded, reason, gemini_ms = generate_answer(
                query,
                evidence,
            )

            total_ms = (
                time.perf_counter() - started
            ) * 1000

            self._send(
                200,
                {
                    "query": query,
                    "answer": answer,
                    "grounded": grounded,
                    "guardrail_reason": reason,
                    "evidence_count": len(evidence),
                    "retrieval_ms": round(retrieval_ms, 3),
                    "rerank_ms": None,
                    "gemini_ms": (
                        round(gemini_ms, 3)
                        if gemini_ms is not None
                        else None
                    ),
                    "total_ms": round(total_ms, 3),
                    "deployment": "vercel-lightweight",
                },
            )

        except Exception as exc:
            self._send(
                500,
                {
                    "detail": "Query processing failed",
                    "error": str(exc),
                },
            )
