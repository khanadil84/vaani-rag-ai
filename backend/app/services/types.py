"""Data types for the VaaniRag service layer.

The fields of :class:`QueryResult` mirror the HTTP API contract exactly:
``/api/query`` returns precisely these keys and nothing else. Values that cannot
be produced honestly are ``None`` — never invented.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class QueryResult:
    """The result of running one query through the VaaniRag pipeline.

    Attributes match the public API contract field-for-field:

        query           the submitted query text
        answer          generated grounded answer, or None if none was produced
        grounded        whether the answer is grounded in retrieved evidence
        guardrail_reason human-readable reason for the guardrail decision
        evidence_count  number of evidence chunks used
        retrieval_ms    BM25/FAISS retrieval wall time, or None if not measured
        rerank_ms       CrossEncoder reranking wall time, or None if not measured
        gemini_ms       Gemini generation wall time, or None if not measured
        total_ms        end-to-end pipeline wall time, or None if not measured
    """

    query: str
    answer: str | None
    grounded: bool
    guardrail_reason: str | None
    evidence_count: int
    retrieval_ms: float | None
    rerank_ms: float | None
    gemini_ms: float | None
    total_ms: float | None

    def to_dict(self) -> dict[str, Any]:
        return {
            "query": self.query,
            "answer": self.answer,
            "grounded": self.grounded,
            "guardrail_reason": self.guardrail_reason,
            "evidence_count": self.evidence_count,
            "retrieval_ms": self.retrieval_ms,
            "rerank_ms": self.rerank_ms,
            "gemini_ms": self.gemini_ms,
            "total_ms": self.total_ms,
        }