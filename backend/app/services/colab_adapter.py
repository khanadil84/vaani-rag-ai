"""Colab pipeline integration adapter — REAL PIPELINE IS NOT PRESENT LOCALLY.

The validated VaaniRag pipeline (BM25 retrieval, query expansion, CrossEncoder
reranking, semantic evidence guardrail, Gemini 2.5 Flash generation) exists in the
Google Colab notebook. It is NOT available in this local repository, so it cannot
be imported directly.

This adapter is the explicit integration boundary. It does NOT re-implement any
part of the pipeline and it does NOT fabricate answers, evidence, guardrail
decisions, or latency figures. Every measurable field is returned as ``None`` and
the guardrail reason states plainly that the real pipeline is not connected.

To connect the real pipeline (no API or dashboard changes needed):
  1. Export the pipeline from Colab as a Python module and place it at
     ``backend/pipeline/vaanirag.py``.
  2. Make sure it exposes a class named ``VaaniRagPipeline`` that satisfies the
     :class:`app.services.vaanirag_service.VaaniRagService` protocol (a ``query``
     method returning :class:`app.services.types.QueryResult` and a ``connected``
     attribute set to True).
  3. The resolver in ``app/services/__init__.py`` will pick it up automatically.

Benchmark figures from the Colab validation (Recall@20 89.42%, avg retrieval
latency 75.399 ms, P50 65.226 ms, P70 82.551 ms, P100 345.665 ms, voice pipeline
5.145 s) are NOT claimed here because they were not measured by this local process.
"""

from __future__ import annotations

from app.services.types import QueryResult

_NOT_CONNECTED_REASON = (
    "RAG pipeline is not connected: the validated Colab pipeline "
    "(BM25 + query expansion + CrossEncoder reranking + semantic evidence "
    "guardrail + Gemini 2.5 Flash) is not available in this local environment. "
    "No answer was produced and no retrieval/generation latency was measured."
)


class ColabPipelineAdapter:
    """Placeholder adapter that honestly reports the pipeline is not connected."""

    name = "colab-pipeline"
    connected = False

    def query(self, query: str, top_k: int | None = None) -> QueryResult:
        """Return an honest NOT_CONNECTED result without inventing any values."""
        return QueryResult(
            query=query,
            answer=None,
            grounded=False,
            guardrail_reason=_NOT_CONNECTED_REASON,
            evidence_count=0,
            retrieval_ms=None,
            rerank_ms=None,
            gemini_ms=None,
            total_ms=None,
        )