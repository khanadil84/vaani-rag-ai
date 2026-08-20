export type VoiceState =
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'retrieving'
  | 'generating'
  | 'completed'

export type VoiceErrorKind = 'none' | 'permission' | 'unavailable' | 'connection'

export type VoiceLanguage = 'en' | 'hi' | 'hinglish'

export interface VoiceLanguageOption {
  id: VoiceLanguage
  label: string
  hint: string
}

export const VOICE_LANGUAGES: VoiceLanguageOption[] = [
  { id: 'en', label: 'English', hint: 'English' },
  { id: 'hi', label: 'हिन्दी', hint: 'Hindi' },
  { id: 'hinglish', label: 'Hinglish', hint: 'Hindi + English' },
]

export interface TranscriptionRequest {
  audio: Blob
  language: VoiceLanguage
}

export interface TranscriptionResult {
  ok: boolean
  text: string | null
  error: string | null
}

export interface VoiceEngineAdapter {
  readonly id: string
  transcribe(request: TranscriptionRequest): Promise<TranscriptionResult>
}