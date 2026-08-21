from __future__ import annotations

import os
import time
from typing import Any

from google import genai


class GeminiModelHarness:
    """Structured Gemini generation harness with retry and error recovery."""

    provider_name = "gemini"

    def __init__(
        self,
        model_name: str = "gemini-2.5-flash",
        max_retries: int = 2,
        timeout_seconds: float = 15.0,
    ):
        api_key = os.environ.get("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not configured.")

        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name
        self.max_retries = max_retries
        self.timeout_seconds = timeout_seconds

    def generate(self, prompt: str) -> str:
        if not isinstance(prompt, str) or not prompt.strip():
            raise ValueError("Gemini prompt must be a non-empty string.")

        last_error: Exception | None = None

        for attempt in range(self.max_retries + 1):
            try:
                started = time.perf_counter()

                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                )

                elapsed = time.perf_counter() - started

                text = getattr(response, "text", None)

                if not text or not text.strip():
                    raise RuntimeError(
                        "Gemini returned an empty response."
                    )

                return text.strip()

            except Exception as exc:
                last_error = exc

                if attempt >= self.max_retries:
                    break

                # Small bounded backoff for transient failures.
                time.sleep(0.5 * (attempt + 1))

        raise RuntimeError(
            f"Gemini generation failed after "
            f"{self.max_retries + 1} attempts: {last_error}"
        ) from last_error


gemini_harness = GeminiModelHarness()

print("=" * 70)
print("VAANIRAG GEMINI MODEL HARNESS")
print("=" * 70)
print("Provider:", gemini_harness.provider_name)
print("Model:", gemini_harness.model_name)
print("Retries:", gemini_harness.max_retries)
print("Timeout policy:", gemini_harness.timeout_seconds, "seconds")
print("[OK] Gemini harness initialized")
print("=" * 70)