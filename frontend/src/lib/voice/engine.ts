import type { VoiceEngineAdapter } from './types'

/**
 * Voice engine seam.
 *
 * The Voice Command Center runs in local preview mode until a real STT
 * adapter is registered here (e.g. Sarvam STT calling POST /api/voice/transcribe).
 * Until then, only the user's real microphone input and local UI state are used —
 * no fabricated transcripts or answers.
 */

let activeEngine: VoiceEngineAdapter | null = null

export function setVoiceEngine(engine: VoiceEngineAdapter | null): void {
  activeEngine = engine
}

export function getVoiceEngine(): VoiceEngineAdapter | null {
  return activeEngine
}