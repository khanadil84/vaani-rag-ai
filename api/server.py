from http.server import HTTPServer
import json
import os
import tempfile

import requests
from dotenv import load_dotenv

from query import handler as QueryHandler


# ============================================================
# LOCAL ENVIRONMENT
# ============================================================

load_dotenv(
    r"C:\Users\ASUS\vaani-rag-ai\backend\.env"
)


# ============================================================
# HTTP HANDLER
# ============================================================

class Handler(QueryHandler):

    def _send_json(self, body, status=200):
        data = json.dumps(
            body,
            ensure_ascii=False,
        ).encode("utf-8")

        self.send_response(status)
        self.send_header(
            "Content-Type",
            "application/json",
        )
        self.send_header(
            "Access-Control-Allow-Origin",
            "*",
        )
        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS",
        )
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization",
        )
        self.send_header(
            "Content-Length",
            str(len(data)),
        )
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header(
            "Access-Control-Allow-Origin",
            "*",
        )
        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS",
        )
        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization",
        )
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?", 1)[0]

        # Health
        if path in (
            "/",
            "/health",
            "/api/health",
        ):
            self._send_json({
                "status": "operational",
                "service": "VaaniRAG AI Backend",
                "version": "0.1.0",
                "deployment": "local",
            })
            return

        # Metrics
        if path in (
            "/metrics",
            "/api/metrics",
        ):
            self._send_json({
                "status": "operational",
                "service": "VaaniRAG AI Backend",
                "version": "0.1.0",
                "deployment": "local",
                "queriesProcessed": 0,
                "transcriptions": 0,
                "avgLatencyMs": None,
                "sourcesIndexed": 0,
                "guardrailBlocks": 0,
                "uptimeSeconds": 0,
                "lastQuery": None,
            })
            return

        self.send_error(
            404,
            "Not Found",
        )

    def do_POST(self):
        path = self.path.split("?", 1)[0]

        # Sarvam STT
        if path == "/api/stt":
            self.handle_stt()
            return

        # Existing RAG /api/query
        super().do_POST()

    def handle_stt(self):
        api_key = os.environ.get(
            "SARVAM_API_KEY"
        )

        if not api_key:
            self._send_json(
                {
                    "detail":
                    "SARVAM_API_KEY is not configured"
                },
                500,
            )
            return

        try:
            content_type = self.headers.get(
                "Content-Type",
                "",
            )

            if "multipart/form-data" not in content_type:
                self._send_json(
                    {
                        "detail":
                        "Expected multipart/form-data"
                    },
                    400,
                )
                return

            # ------------------------------------------------
            # Find multipart boundary
            # ------------------------------------------------

            boundary = None

            for part in content_type.split(";"):
                part = part.strip()

                if part.startswith("boundary="):
                    boundary = part.split(
                        "=",
                        1,
                    )[1].strip('"')

            if not boundary:
                self._send_json(
                    {
                        "detail":
                        "Multipart boundary missing"
                    },
                    400,
                )
                return

            # ------------------------------------------------
            # Read request
            # ------------------------------------------------

            length = int(
                self.headers.get(
                    "Content-Length",
                    "0",
                )
            )

            raw = self.rfile.read(length)

            boundary_bytes = (
                b"--" +
                boundary.encode()
            )

            parts = raw.split(
                boundary_bytes
            )

            audio_data = None
            filename = "recording.wav"

            # ------------------------------------------------
            # Extract file field
            # ------------------------------------------------

            for part in parts:

                if (
                    b"Content-Disposition:"
                    not in part
                ):
                    continue

                if (
                    b'name="file"'
                    not in part
                ):
                    continue

                header_end = part.find(
                    b"\r\n\r\n"
                )

                if header_end == -1:
                    continue

                headers = part[
                    :header_end
                ]

                body = part[
                    header_end + 4:
                ]

                # Remove multipart ending
                if body.endswith(
                    b"\r\n"
                ):
                    body = body[:-2]

                filename_marker = (
                    b'filename="'
                )

                filename_start = (
                    headers.find(
                        filename_marker
                    )
                )

                if filename_start >= 0:

                    filename_start += len(
                        filename_marker
                    )

                    filename_end = (
                        headers.find(
                            b'"',
                            filename_start,
                        )
                    )

                    if (
                        filename_end >
                        filename_start
                    ):
                        filename = (
                            headers[
                                filename_start:
                                filename_end
                            ]
                            .decode(
                                "utf-8",
                                errors="ignore",
                            )
                        )

                audio_data = body
                break

            if not audio_data:
                self._send_json(
                    {
                        "detail":
                        "Audio file is required"
                    },
                    400,
                )
                return

            # ------------------------------------------------
            # Save temporary audio
            # ------------------------------------------------

            with tempfile.NamedTemporaryFile(
                suffix=".wav",
                delete=False,
            ) as temp:

                temp.write(
                    audio_data
                )

                temp_path = temp.name

            try:

                # ------------------------------------------------
                # Sarvam STT
                # ------------------------------------------------

                url = (
                    "https://api.sarvam.ai/"
                    "speech-to-text"
                )

                headers = {
                    "api-subscription-key":
                    api_key,
                }

                with open(
                    temp_path,
                    "rb",
                ) as audio_file:

                    files = {
                        "file": (
                            filename,
                            audio_file,
                            "audio/wav",
                        )
                    }

                    data = {
                        "language_code":
                        "hi-IN",
                    }

                    response = requests.post(
                        url,
                        headers=headers,
                        files=files,
                        data=data,
                        timeout=60,
                    )

                # Give useful Sarvam errors
                if not response.ok:
                    try:
                        detail = response.json()
                    except Exception:
                        detail = response.text

                    self._send_json(
                        {
                            "detail":
                            "Sarvam STT request failed",
                            "sarvam_status":
                            response.status_code,
                            "sarvam_response":
                            detail,
                        },
                        502,
                    )
                    return

                result = response.json()

                transcript = (
                    result.get("transcript")
                    or result.get("text")
                    or ""
                ).strip()

                if not transcript:
                    self._send_json(
                        {
                            "detail":
                            "Sarvam returned an empty transcript"
                        },
                        422,
                    )
                    return

                self._send_json({
                    "transcript":
                    transcript,
                })

            finally:

                try:
                    os.remove(
                        temp_path
                    )
                except OSError:
                    pass

        except Exception as exc:

            self._send_json(
                {
                    "detail":
                    "STT processing failed",
                    "error":
                    str(exc),
                },
                500,
            )


# ============================================================
# START LOCAL SERVER
# ============================================================

port = int(
    os.environ.get(
        "PORT",
        "10000",
    )
)

server = HTTPServer(
    ("0.0.0.0", port),
    Handler,
)

print(
    "VaaniRAG local backend "
    f"listening on port {port}"
)

print(
    "Sarvam API key:",
    "configured"
    if os.environ.get("SARVAM_API_KEY")
    else "NOT CONFIGURED",
)

server.serve_forever()