# ============================================================
# VAANIRAG PHASE 16 — SARVAM STT
# Production-ready version
# ============================================================

import os
import requests


# ------------------------------------------------------------
# LOAD SECRET
# ------------------------------------------------------------

SARVAM_API_KEY = os.environ.get("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise RuntimeError("SARVAM_API_KEY is not configured.")


# ------------------------------------------------------------
# SARVAM STT FUNCTION
# ------------------------------------------------------------

def sarvam_stt(
    audio_path,
    language_code="hi-IN"
):
    """
    Convert Hindi speech audio to text using Sarvam STT.
    """

    url = "https://api.sarvam.ai/speech-to-text"

    headers = {
        "api-subscription-key": SARVAM_API_KEY
    }

    with open(audio_path, "rb") as audio_file:

        files = {
            "file": (
                os.path.basename(audio_path),
                audio_file,
                "audio/wav"
            )
        }

        data = {
            "language_code": language_code
        }

        response = requests.post(
            url,
            headers=headers,
            files=files,
            data=data,
            timeout=60
        )

    response.raise_for_status()

    result = response.json()

    text = (
        result.get("transcript")
        or result.get("text")
        or ""
    )

    return text.strip()


# ------------------------------------------------------------
# STARTUP STATUS
# ------------------------------------------------------------

print("=" * 70)
print("VAANIRAG — SARVAM STT READY")
print("=" * 70)
print("Language:", "hi-IN")
print("API key:", "configured")
print("Function:", "sarvam_stt(audio_path)")
print("[OK] SARVAM STT PRODUCTION READY")
print("=" * 70)