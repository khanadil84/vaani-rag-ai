"""VaaniRAG service layer.

This package defines the boundary between the HTTP API and the retrieval-augmented
generation pipeline. The real, validated pipeline (BM25 + query expansion +
CrossEncoder reranking + semantic evidence guardrail + Gemini 2.5 Flash) lives in
the Google Colab notebook. This layer is the exact seam where that pipeline plugs
in without touching the API contract or the dashboard.
"""

from __future__ import annotations

from app.services.colab_adapter import ColabPipelineAdapter
from app.services.vaanirag_service import VaaniRagService
from app.services.types import QueryResult

__all__ = [
    "ColabPipelineAdapter",
    "QueryResult",
    "VaaniRagService",
]


def resolve_pipeline() -> VaaniRagService:
    """Return the connected VaaniRag pipeline service.

    The resolver tries to import the real pipeline from ``pipeline.vaanirag``
    (the module the Colab pipeline exports). If that module is not present, it
    falls back to the explicitly-marked :class:`ColabPipelineAdapter`, which
    returns an honest NOT_CONNECTED result and never fabricates values.

    To connect the real pipeline later:
      1. Drop the exported pipeline module into ``backend/pipeline/vaanirag.py``
         so that ``import pipeline.vaanirag`` succeeds, and
      2. Ensure it exposes a class named ``VaaniRagPipeline`` whose instances
         satisfy the :class:`VaaniRagService` protocol.
    No API contract or dashboard changes are required.
    """
    try:
        from pipeline.vaanirag import VaaniRagPipeline  # type: ignore[import-not-found]

        return VaaniRagPipeline()
    except Exception:
        return ColabPipelineAdapter()