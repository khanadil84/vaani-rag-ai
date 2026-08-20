import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { api } from './lib/api'
import { setVoiceEngine } from './lib/voice/engine'
import type { VoiceEngineAdapter } from './lib/voice/types'

const sarvamEngine: VoiceEngineAdapter = {
  id: 'sarvam-stt',
  transcribe: ({ audio }) => api.transcribe({ audio }),
}

setVoiceEngine(sarvamEngine)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)