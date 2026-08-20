# ============================================================
# VAANIRAG — RESTORE GEMINI HARNESS
# ============================================================

from google import genai
import os

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"]
)

class GeminiModelHarness:

    provider_name = "gemini"

    def __init__(
        self,
        model_name="gemini-2.5-flash"
    ):
        self.model_name = model_name

    def generate(self, prompt: str) -> str:

        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )

        return response.text.strip()


gemini_harness = GeminiModelHarness()

print("=" * 70)
print("VAANIRAG GEMINI MODEL HARNESS")
print("=" * 70)

print("Provider:", gemini_harness.provider_name)
print("Model:", gemini_harness.model_name)
print("[OK] Gemini harness initialized")
print("=" * 70)