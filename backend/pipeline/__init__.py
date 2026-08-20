"""VaaniRAG pipeline package.

This package is ONLY the bridge/import seam for the real, already-validated
VaaniRAG pipeline (BM25 + query expansion + CrossEncoder reranking + semantic
evidence guardrail + Gemini 2.5 Flash + Sarvam STT), which was built and
validated in Google Colab.

It does NOT re-implement RAG, BM25, embeddings, reranking, guardrails, or
generation. It does NOT build indexes and does NOT contain a dataset. If the
real pipeline module is not present locally, every query returns an honest
NOT_CONNECTED result with no fabricated values.

How to attach the real Colab pipeline (no API/contract changes needed):
  - Export the working pipeline from Colab as a Python module and save it at
    ``backend/pipeline/real_pipeline.py`` exposing class
    ``RealVaaniRagPipeline`` (with a ``query(query, top_k=None)`` method and a
    ``connected = True`` attribute), OR
  - point the bridge at it via environment variables:
        VAANIRAG_PIPELINE_MODULE=pipeline.my_colab_module
        VAANIRAG_PIPELINE_CLASS=MyPipelineClass
  Then restart the backend. ``app.services.resolve_pipeline`` picks it up
  automatically and ``/api/health`` reports the RAG component as operational.

The bridge reads secrets (e.g. GEMINI_API_KEY) only from the server
environment / ``backend/.env``; nothing secret ever reaches the frontend.
"""