from http.server import BaseHTTPRequestHandler
import json
import os
import pickle
import re
import time
from pathlib import Path

import pandas as pd
from google import genai


ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT = ROOT / "backend" / "pipeline" / "retrieval_checkpoint"

_bm25 = None
_corpus = None
_exact_answers = None


def normalize(text):
    return re.sub(
        r"[^a-z0-9\u0900-\u097F]+",
        "",
        str(text).lower(),
    )


def load_retrieval():
    global _bm25, _corpus, _exact_answers

    if _bm25 is not None:
        return

    with open(CHECKPOINT / "bm25_index.pkl", "rb") as f:
        _bm25 = pickle.load(f)

    _corpus = pd.read_parquet(
        CHECKPOINT / "sentence_corpus.parquet",
        columns=[
            "query_en",
            "query_hi",
            "answer_en",
            "answer_hi",
            "passage_en",
            "passage_hi",
        ],
    )

    _exact_answers = {}

    for row in _corpus.itertuples(index=False):
        query_en = normalize(row.query_en)

        if query_en and row.answer_en:
            _exact_answers.setdefault(
                ("en", query_en),
                str(row.answer_en).strip(),
            )

        query_hi = normalize(row.query_hi)

        if query_hi and row.answer_hi:
            _exact_answers.setdefault(
                ("hi", query_hi),
                str(row.answer_hi).strip(),
            )


def retrieve(query, top_k=5):
    load_retrieval()

    has_hindi = any(
        "\u0900" <= char <= "\u097F"
        for char in query
    )

    language = "hi" if has_hindi else "en"

    exact_answer = _exact_answers.get(
        (language, normalize(query))
    )

    scores = _bm25.get_scores(
        query.lower().split()
    )

    candidate_k = max(top_k, 20)

    ranked = sorted(
        enumerate(scores),
        key=lambda item: item[1],
        reverse=True,
    )[:candidate_k]

    evidence = []

    passage_key = (
        "passage_hi"
        if has_hindi
        else "passage_en"
    )

    answer_key = (
        "answer_hi"
        if has_hindi
        else "answer_en"
    )

    query_key = (
        "query_hi"
        if has_hindi
        else "query_en"
    )

    for index, score in ranked[:top_k]:
        row = _corpus.iloc[index]

        passage = str(
            row[passage_key] or ""
        )

        if not passage:
            fallback = (
                "passage_en"
                if has_hindi
                else "passage_hi"
            )

            passage = str(
                row[fallback] or ""
            )

        if passage:
            evidence.append(
                {
                    "rank": len(evidence) + 1,
                    "score": float(score),
                    "passage": passage,
                    "answer": str(
                        row[answer_key] or ""
                    ),
                    "query_match": str(
                        row[query_key] or ""
                    ),
                }
            )

    return evidence, exact_answer


def generate_answer(query, evidence, exact_answer):
    if exact_answer:
        return (
            exact_answer,
            True,
            "EXACT_CORPUS_MATCH",
            0.0,
        )

    if not evidence or evidence[0]["score"] <= 0:
        return (
            None,
            False,
            "INSUFFICIENT_EVIDENCE",
            None,
        )

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return (
            None,
            False,
            "GEMINI_API_KEY_NOT_CONFIGURED",
            None,
        )

    context = "\n\n".join(
        f"[Evidence {item['rank']}]\n{item['passage']}"
        for item in evidence
    )

    client = genai.Client(
        api_key=api_key
    )

    started = time.perf_counter()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
You are VaaniRAG, a grounded retrieval assistant.

Answer ONLY from the evidence below.

Do not use outside knowledge.
Do not invent facts.

If the evidence genuinely does not contain
enough information, clearly say that the
evidence is insufficient.

Question:
{query}

Evidence:
{context}

Give a concise grounded answer.
""",
    )

    generation_ms = (
        time.perf_counter() - started
    ) * 1000

    answer = (
        response.text or ""
    ).strip()

    if not answer:
        return (
            None,
            False,
            "EMPTY_GENERATION",
            generation_ms,
        )

    # Detect common model phrases indicating
    # that the retrieved evidence is insufficient.
    insufficient_patterns = [
        r"evidence.*insufficient",
        r"evidence.*does not contain",
        r"evidence.*doesn't contain",
        r"provided evidence.*does not contain",
        r"provided evidence.*doesn't contain",
        r"evidence provided.*does not contain",
        r"evidence provided.*doesn't contain",
        r"does not contain enough information",
        r"doesn't contain enough information",
        r"not enough information",
        r"insufficient information",
        r"insufficient to answer",
        r"insufficient to explain",
        r"cannot answer",
        r"can't answer",
        r"unable to answer",
        r"cannot determine",
        r"can't determine",
    ]

    answer_lower = answer.lower()

    if any(
        re.search(pattern, answer_lower)
        for pattern in insufficient_patterns
    ):
        return (
            answer,
            False,
            "INSUFFICIENT_EVIDENCE",
            generation_ms,
        )

    return (
        answer,
        True,
        "EVIDENCE_SUFFICIENT",
        generation_ms,
    )


class handler(BaseHTTPRequestHandler):

    def _send(self, status, body):
        data = json.dumps(
            body,
            ensure_ascii=False,
        ).encode("utf-8")

        self.send_response(status)

        self.send_header(
            "Content-Type",
            "application/json",
        )

        self.send_header(
            "Access-Control-Allow-Origin",
            "*",
        )

        self.send_header(
            "Access-Control-Allow-Methods",
            "POST, OPTIONS",
        )

        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type",
        )

        self.send_header(
            "Content-Length",
            str(len(data)),
        )

        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_POST(self):
        if self.path != "/api/query":
            self._send(
                404,
                {"detail": "Not found"},
            )
            return

        started = time.perf_counter()

        try:
            length = int(
                self.headers.get(
                    "Content-Length",
                    "0",
                )
            )

            payload = json.loads(
                self.rfile.read(length)
                .decode("utf-8")
            )

            query = str(
                payload.get("query", "")
            ).strip()

            if not query:
                self._send(
                    400,
                    {"detail": "Query is required"},
                )
                return

            if len(query) > 500:
                self._send(
                    400,
                    {
                        "detail":
                        "Query exceeds 500 characters"
                    },
                )
                return

            top_k = min(
                max(
                    int(
                        payload.get("topK")
                        or 5
                    ),
                    1,
                ),
                20,
            )

            retrieval_started = (
                time.perf_counter()
            )

            evidence, exact_answer = retrieve(
                query,
                top_k,
            )

            retrieval_ms = (
                time.perf_counter()
                - retrieval_started
            ) * 1000

            answer, grounded, reason, gemini_ms = (
                generate_answer(
                    query,
                    evidence,
                    exact_answer,
                )
            )

            total_ms = (
                time.perf_counter()
                - started
            ) * 1000

            self._send(
                200,
                {
                    "query": query,
                    "answer": answer,
                    "grounded": grounded,
                    "guardrail_reason": reason,
                    "evidence_count": len(evidence),
                    "retrieval_ms": round(
                        retrieval_ms,
                        3,
                    ),
                    "rerank_ms": None,
                    "gemini_ms": (
                        round(
                            gemini_ms,
                            3,
                        )
                        if gemini_ms is not None
                        else None
                    ),
                    "total_ms": round(
                        total_ms,
                        3,
                    ),
                    "deployment":
                        "vercel-lightweight",
                },
            )

        except Exception as exc:
            self._send(
                500,
                {
                    "detail":
                    "Query processing failed",
                    "error": str(exc),
                },
            )