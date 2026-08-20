import os
import tempfile
import time

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sarvamai import SarvamAI

from app.services import resolve_pipeline

load_dotenv()

app = FastAPI(
    title="VaaniRAG AI Backend",
    version="0.1.0",
)

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise RuntimeError("SARVAM_API_KEY is not configured")

LOCAL_DASHBOARD_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=LOCAL_DASHBOARD_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

START_TIME = time.time()
MAX_QUERY_LENGTH = 500

_metrics = {
    "queries_processed": 0,
    "guardrail_blocks": 0,
    "stt_transcriptions": 0,
    "total_handle_ms": 0.0,
    "measured_queries": 0,
    "last_query": None,
}

# The single pipeline seam. Resolves to the real Colab pipeline if it has been
# dropped into backend/pipeline/, otherwise to the honest ColabPipelineAdapter.
pipeline = resolve_pipeline()


def uptime_seconds() -> float:
    return round(time.time() - START_TIME, 2)


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="The text query to run through the RAG pipeline")
    topK: int | None = Field(default=None, ge=1, le=50, description="Optional top-K override for retrieval")


def validate_query(query: str) -> None:
    if not query.strip():
        _metrics["guardrail_blocks"] += 1
        raise HTTPException(
            status_code=400,
            detail="Blocked by guardrail: query is empty.",
        )
    if len(query) > MAX_QUERY_LENGTH:
        _metrics["guardrail_blocks"] += 1
        raise HTTPException(
            status_code=400,
            detail=f"Blocked by guardrail: query exceeds the {MAX_QUERY_LENGTH} character limit.",
        )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "VaaniRAG AI Backend",
    }


@app.get("/api/health")
def api_health():
    return {
        "status": "degraded" if not pipeline.connected else "operational",
        "service": "VaaniRAG AI Backend",
        "version": "0.1.0",
        "uptime": uptime_seconds(),
        "components": {
            "stt": {
                "status": "operational",
                "model": "saaras:v3",
            },
            "rag": {
                "status": "operational" if pipeline.connected else "not_connected",
                "pipeline": pipeline.name,
                "reason": None if pipeline.connected else "The validated Colab pipeline is not available in this local environment.",
            },
        },
    }


@app.post("/api/query")
def query(payload: QueryRequest):
    started = time.perf_counter()

    validate_query(payload.query)

    result = pipeline.query(payload.query, top_k=payload.topK).to_dict()

    _metrics["queries_processed"] += 1
    if result["total_ms"] is not None:
        _metrics["total_handle_ms"] += result["total_ms"]
        _metrics["measured_queries"] += 1
    _metrics["last_query"] = result

    return result


@app.get("/api/metrics")
def api_metrics():
    processed = _metrics["queries_processed"]
    measured = _metrics["measured_queries"]
    return {
        "queriesProcessed": processed,
        "transcriptions": _metrics["stt_transcriptions"],
        "avgLatencyMs": round(_metrics["total_handle_ms"] / measured, 2) if measured else None,
        "sourcesIndexed": 0,
        "guardrailBlocks": _metrics["guardrail_blocks"],
        "uptimeSeconds": uptime_seconds(),
        "lastQuery": _metrics["last_query"],
    }


@app.post("/stt")
async def speech_to_text(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Audio file is required",
        )

    audio_data = await file.read()

    if not audio_data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded audio file is empty",
        )

    suffix = os.path.splitext(file.filename)[1] or ".wav"

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_file.write(audio_data)
            temp_path = temp_file.name

        client = SarvamAI(
            api_subscription_key=SARVAM_API_KEY
        )

        with open(temp_path, "rb") as audio_file:
            response = client.speech_to_text.transcribe(
                file=audio_file,
                model="saaras:v3",
                language_code="hi-IN",
                mode="transcribe",
            )

        _metrics["stt_transcriptions"] += 1

        return {
            "success": True,
            "language": "hi-IN",
            "model": "saaras:v3",
            "transcript": response.transcript,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Speech-to-text failed: {exc}",
        ) from exc

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)