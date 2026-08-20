# ============================================================
# VAANIRAG PHASE 16 — SARVAM STT
# ============================================================

!pip -q install requests

import os
import requests
from google.colab import userdata


# ------------------------------------------------------------
# LOAD SECRET
# ------------------------------------------------------------

SARVAM_API_KEY = userdata.get("SARVAM_API_KEY")

assert SARVAM_API_KEY, "SARVAM_API_KEY not available"


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


print("=" * 70)
print("VAANIRAG — SARVAM STT READY")
print("=" * 70)
print("Language:", "hi-IN")
print("API key:", "configured")
print("Function:", "sarvam_stt(audio_path)")
print("[OK] PHASE 16 STT FOUNDATION READY")
print("=" * 70)