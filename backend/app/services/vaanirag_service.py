"""The VaaniRag service interface.

A VaaniRagService is the single seam between the HTTP layer and the RAG pipeline.
The validated Colab pipeline must implement this protocol to be used by the API.
No other code in the backend depends on pipeline internals.
"""

from __future__ import annotations

from typing import Protocol, runtime_checkable

from app.services.types import QueryResult


@runtime_checkable
class VaaniRagService(Protocol):
    """Interface every concrete RAG pipeline adapter must implement.

    Implementations::

        class VaaniRagPipeline:              # real pipeline (from Colab)
            name = "vaanirag-pipeline"
            connected = True

            def query(self, query: str, top_k: int | None = None) -> QueryResult:
                ...

        class ColabPipelineAdapter:          # placeholder until real pipeline lands
            name = "colab-pipeline"
            connected = False

            def query(self, query: str, top_k: int | None = None) -> QueryResult:
                ...

    The ``connected`` attribute tells the health endpoint whether the real
    pipeline is wired up. ``query`` must return a :class:`QueryResult` with
    honest values (None where a stage did not run).
    """

    name: str
    connected: bool

    def query(self, query: str, top_k: int | None = None) -> QueryResult: ...