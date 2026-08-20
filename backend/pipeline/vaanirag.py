"""VaaniRAG pipeline bridge.

BRIDGE ONLY — this module is the single import seam where the real, already-
validated Colab pipeline plugs in. It implements the ``VaaniRagService``
protocol consumed by ``app.services`` and the HTTP API.

Rules enforced here:
  * It never implements RAG, BM25, embeddings, reranking, guardrails, or
    generation itself.
  * It never fabricates answers, evidence, guardrail decisions, or latency
    figures. When the real pipeline is not loaded, every measurable field is
    ``None`` and the guardrail reason states the pipeline is not connected.
  * It never hardcodes the Colab benchmark metrics (Recall@20 89.42%,
    75.399 ms average retrieval, P50/P70/P100, ~5.145 s voice pipeline).
    Those figures are reported only by the real pipeline process when it runs.
  * Secrets (e.g. GEMINI_API_KEY) are read only from the server environment /
    ``backend/.env`` inside the real pipeline module — never exposed to the API.
"""

from __future__ import annotations

import importlib
import os

from app.services.types import QueryResult

_NOT_CONNECTED_REASON = (
    "RAG pipeline is not connected: the real validated pipeline "
    "(BM25 + query expansion + CrossEncoder reranking + semantic evidence "
    "guardrail + Gemini 2.5 Flash) has not been exported into this local "
    "environment. No answer was produced and no retrieval/generation latency "
    "was measured."
)

_DEFAULT_MODULE = "pipeline.real_pipeline"
_DEFAULT_CLASS = "RealVaaniRagPipeline"


def _load_real_pipeline() -> object | None:
    """Import and instantiate the real pipeline, or return None.

    The bridge locates the real pipeline via ``VAANIRAG_PIPELINE_MODULE`` /
    ``VAANIRAG_PIPELINE_CLASS`` (defaulting to the documented Colab export
    location). Any failure (module missing, class missing, not instantiable,
    no ``query`` method) is treated as "not connected" — never a fabricated
    answer and never a crash at startup.
    """
    module_name = os.getenv("VAANIRAG_PIPELINE_MODULE", _DEFAULT_MODULE)
    class_name = os.getenv("VAANIRAG_PIPELINE_CLASS", _DEFAULT_CLASS)

    try:
        module = importlib.import_module(module_name)
        cls = getattr(module, class_name)
        impl = cls()
        if callable(getattr(impl, "query", None)):
            return impl
    except Exception:
        return None

    return None


class VaaniRagPipeline:
    """Bridge exposing the real pipeline (when present) to the VaaniRag API.

    ``connected`` is True only when the real pipeline module loaded and was
    instantiated. Until then ``query`` returns an honest NOT_CONNECTED result.
    """

    def __init__(self) -> None:
        self._impl = _load_real_pipeline()
        self.name = "vaanirag-pipeline"
        self.connected = self._impl is not None

    def query(self, query: str, top_k: int | None = None) -> QueryResult:
        if self._impl is None:
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

        raw = self._impl.query(query, top_k=top_k)
        return self._to_query_result(query, raw)

    @staticmethod
    def _to_query_result(query: str, raw: object) -> QueryResult:
        """Convert the real pipeline's output into the API's QueryResult.

        Values are taken from the real result only; anything absent is reported
        as None (not measured) rather than invented.
        """
        if isinstance(raw, QueryResult):
            return raw

        if isinstance(raw, dict):
            return QueryResult(
                query=str(raw.get("query", query)),
                answer=raw.get("answer"),
                grounded=bool(raw.get("grounded", False)),
                guardrail_reason=raw.get("guardrail_reason"),
                evidence_count=(
                    int(raw["evidence_count"])
                    if raw.get("evidence_count") is not None
                    else 0
                ),
                retrieval_ms=raw.get("retrieval_ms"),
                rerank_ms=raw.get("rerank_ms"),
                gemini_ms=raw.get("gemini_ms"),
                total_ms=raw.get("total_ms"),
            )

        return QueryResult(
            query=query,
            answer=None,
            grounded=False,
            guardrail_reason=(
                "Real pipeline returned an unrecognized result format; "
                "no answer could be produced."
            ),
            evidence_count=0,
            retrieval_ms=None,
            rerank_ms=None,
            gemini_ms=None,
            total_ms=None,
        )