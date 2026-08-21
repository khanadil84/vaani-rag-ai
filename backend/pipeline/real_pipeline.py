"""Real VaaniRAG pipeline.

BM25 + query expansion cache + CrossEncoder semantic evidence guardrail
+ Gemini 2.5 Flash generation.

This module connects the already-validated VaaniRAG components to the
existing backend service layer. It does not replace the API contract,
dashboard, or validated retrieval artifacts.
"""

from __future__ import annotations

import os
import pickle
import time
from pathlib import Path

import numpy as np
import pandas as pd
from dotenv import load_dotenv

from app.services.types import QueryResult


# ------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------

_CHECKPOINT_DIR = (
    Path(__file__).resolve().parent / "retrieval_checkpoint"
)

_ENV_FILE = (
    Path(__file__).resolve().parent.parent / ".env"
)

_MODEL_NAME = (
    "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1"
)

_GUARDRAIL_MIN_SCORE = 1.0
_DEFAULT_TOP_K = 20
_GUARDRAIL_TOP_K = 5


class RealVaaniRagPipeline:
    """Production bridge for the validated VaaniRAG pipeline."""

    name = "vaanirag-pipeline"
    connected = False

    def __init__(self) -> None:
        self._gemini = None
        self._reranker = None
        self._tokenized_corpus = None

        self.connected = False

        self._load_env()
        self._load_checkpoint()
        self._load_reranker()
        self._load_gemini()

        if self._gemini is None:
            raise RuntimeError(
                "GEMINI_API_KEY is missing or Gemini harness "
                "failed to initialize."
            )

        self.connected = True

    # ------------------------------------------------------------------
    # Environment
    # ------------------------------------------------------------------

    def _load_env(self) -> None:
        load_dotenv(_ENV_FILE)

        if not os.getenv("GEMINI_API_KEY"):
            raise RuntimeError(
                f"GEMINI_API_KEY not found in {_ENV_FILE}"
            )

    # ------------------------------------------------------------------
    # Retrieval checkpoint
    # ------------------------------------------------------------------

    def _load_checkpoint(self) -> None:
        from pipeline import bm25_cache
        from pipeline import semantic_guardrail

        required_files = [
            "bm25_index.pkl",
            "sentence_corpus.parquet",
            "tokenized_corpus.pkl",
        ]

        for filename in required_files:
            path = _CHECKPOINT_DIR / filename

            if not path.exists():
                raise FileNotFoundError(
                    f"Required VaaniRAG artifact missing: {path}"
                )

        with open(
            _CHECKPOINT_DIR / "bm25_index.pkl",
            "rb",
        ) as handle:
            bm25_index = pickle.load(handle)

        sentence_corpus = pd.read_parquet(
            _CHECKPOINT_DIR / "sentence_corpus.parquet"
        )

        with open(
            _CHECKPOINT_DIR / "tokenized_corpus.pkl",
            "rb",
        ) as handle:
            tokenized_corpus = pickle.load(handle)

        if "query_hi" not in sentence_corpus.columns:
            raise RuntimeError(
                "sentence_corpus is missing required column: query_hi"
            )

        if "answer_hi" not in sentence_corpus.columns:
            raise RuntimeError(
                "sentence_corpus is missing required column: answer_hi"
            )

        first_rows = sentence_corpus.drop_duplicates(
            subset="query_hi",
            keep="first",
        )

        query_expansion_cache = {
            str(row["query_hi"]):
            f"{row['query_hi']} {row['answer_hi']}"
            for _, row in first_rows.iterrows()
            if pd.notna(row["query_hi"])
            and pd.notna(row["answer_hi"])
        }

        bm25_cache.query_expansion_cache = (
            query_expansion_cache
        )

        bm25_cache.bm25_index = bm25_index
        bm25_cache.sentence_corpus = sentence_corpus
        bm25_cache.np = np

        semantic_guardrail.np = np

        self._tokenized_corpus = tokenized_corpus

    # ------------------------------------------------------------------
    # CrossEncoder
    # ------------------------------------------------------------------

    def _load_reranker(self) -> None:
        from sentence_transformers import CrossEncoder
        from pipeline import semantic_guardrail

        reranker = CrossEncoder(
            _MODEL_NAME,
            max_length=256,
        )

        semantic_guardrail.reranker = reranker

        self._reranker = reranker

    # ------------------------------------------------------------------
    # Gemini
    # ------------------------------------------------------------------

    def _load_gemini(self) -> None:
        from pipeline import gemini_harness

        self._gemini = (
            gemini_harness.GeminiModelHarness(
                model_name="gemini-2.5-flash"
            )
        )

    # ------------------------------------------------------------------
    # Main query path
    # ------------------------------------------------------------------

    def query(
        self,
        query: str,
        top_k: int | None = None,
    ) -> QueryResult:

        if not self.connected:
            raise RuntimeError(
                "VaaniRAG pipeline is not connected."
            )

        query = str(query).strip()

        if not query:
            return QueryResult(
                query=query,
                answer=None,
                grounded=False,
                guardrail_reason="EMPTY_QUERY",
                evidence_count=0,
                retrieval_ms=0.0,
                rerank_ms=0.0,
                gemini_ms=None,
                total_ms=0.0,
            )

        from pipeline import bm25_cache
        from pipeline import semantic_guardrail

        started = time.perf_counter()

        k = (
            int(top_k)
            if top_k is not None
            else _DEFAULT_TOP_K
        )

        # --------------------------------------------------------------
        # 1. BM25 retrieval
        # --------------------------------------------------------------

        retrieval_started = time.perf_counter()

        evidence, from_cache = (
            bm25_cache.retrieve_with_bm25_cache(
                query,
                top_k=k,
            )
        )

        retrieval_ms = (
            time.perf_counter()
            - retrieval_started
        ) * 1000.0

        # --------------------------------------------------------------
        # 2. CrossEncoder semantic guardrail
        #
        # Only the strongest candidates are reranked. This preserves
        # the guardrail while avoiding unnecessary CrossEncoder work
        # over all 20 BM25 candidates.
        # --------------------------------------------------------------

        guardrail_evidence = evidence[:_GUARDRAIL_TOP_K]

        rerank_started = time.perf_counter()

        grounded, reason = (
            semantic_guardrail.evidence_guard(
                query,
                guardrail_evidence,
                min_score=_GUARDRAIL_MIN_SCORE,
            )
        )

        rerank_ms = (
            time.perf_counter()
            - rerank_started
        ) * 1000.0

        # --------------------------------------------------------------
        # 3. Gemini only when evidence is sufficient
        # --------------------------------------------------------------

        answer = None
        gemini_ms = None

        if grounded:

            generation_started = (
                time.perf_counter()
            )

            answer = self._generate_answer(
                query,
                evidence,
            )

            gemini_ms = (
                time.perf_counter()
                - generation_started
            ) * 1000.0

        # --------------------------------------------------------------
        # 4. Total
        # --------------------------------------------------------------

        total_ms = (
            time.perf_counter()
            - started
        ) * 1000.0

        return QueryResult(
            query=query,
            answer=answer,
            grounded=bool(grounded),
            guardrail_reason=reason,
            evidence_count=len(evidence),
            retrieval_ms=round(
                retrieval_ms,
                3,
            ),
            rerank_ms=round(
                rerank_ms,
                3,
            ),
            gemini_ms=(
                round(gemini_ms, 3)
                if gemini_ms is not None
                else None
            ),
            total_ms=round(
                total_ms,
                3,
            ),
        )

    # ------------------------------------------------------------------
    # Grounded Gemini generation
    # ------------------------------------------------------------------

    def _generate_answer(
        self,
        query: str,
        evidence: list,
    ) -> str:

        evidence_text = "\n\n".join(
            f"[{item['rank']}] {item['text']}"
            for item in evidence[:5]
        )

        prompt = (
            "तुम एक विश्वसनीय सहायक हो। "
            "नीचे दिए गए evidence के आधार पर ही "
            "प्रश्न का उत्तर हिंदी में दो।\n\n"

            "यदि evidence में प्रश्न का उत्तर नहीं है, "
            "तो कहो: "
            "'मुझे उपलब्ध जानकारी में इसका विश्वसनीय "
            "उत्तर नहीं मिला।'\n\n"

            "Evidence के बाहर की जानकारी मत जोड़ो।\n\n"

            f"Evidence:\n{evidence_text}\n\n"

            f"प्रश्न: {query}\n\n"

            "उत्तर:"
        )

        answer = self._gemini.generate(prompt)

        return str(answer).strip()