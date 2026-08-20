import { useCallback, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { api } from '../lib/api'
import type { QueryResponse } from '../lib/api'
import { getVoiceEngine } from '../lib/voice/engine'
import type {
  VoiceErrorKind,
  VoiceLanguage,
  VoiceState,
} from '../lib/voice/types'

export interface VoiceSession {
  state: VoiceState
  error: VoiceErrorKind
  language: VoiceLanguage
  transcript: string | null
  result: QueryResponse | null
  queryError: string | null
  isListening: boolean
  levelRef: MutableRefObject<number>
  startListening: () => Promise<void>
  stopListening: () => void
  clear: () => void
  setLanguage: (language: VoiceLanguage) => void
  dismissError: () => void
}

type AudioContextConstructor = typeof AudioContext

function getAudioContext(): AudioContextConstructor | null {
  const win = window as unknown as { AudioContext?: AudioContextConstructor; webkitAudioContext?: AudioContextConstructor }
  return win.AudioContext ?? win.webkitAudioContext ?? null
}

function toErrorKind(err: unknown): VoiceErrorKind {
  if (err instanceof DOMException) {
    if (
      err.name === 'NotAllowedError' ||
      err.name === 'PermissionDeniedError' ||
      err.name === 'SecurityError'
    ) {
      return 'permission'
    }
    if (
      err.name === 'NotFoundError' ||
      err.name === 'NotReadableError' ||
      err.name === 'AbortError' ||
      err.name === 'OverconstrainedError'
    ) {
      return 'unavailable'
    }
  }
  return 'unavailable'
}

export function useVoiceSession(): VoiceSession {
  const [state, setState] = useState<VoiceState>('idle')
  const [error, setError] = useState<VoiceErrorKind>('none')
  const [language, setLanguage] = useState<VoiceLanguage>('en')
  const [transcript, setTranscript] = useState<string | null>(null)
  const [result, setResult] = useState<QueryResponse | null>(null)
  const [queryError, setQueryError] = useState<string | null>(null)

  const stateRef = useRef<VoiceState>('idle')
  const languageRef = useRef<VoiceLanguage>('en')
  const levelRef = useRef(0)

  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const levelLoopRef = useRef<number | null>(null)
  const audioBlobRef = useRef<Blob | null>(null)
  const cancelledRef = useRef(false)

  stateRef.current = state
  languageRef.current = language

  const stopCapture = useCallback(() => {
    if (levelLoopRef.current != null) {
      cancelAnimationFrame(levelLoopRef.current)
      levelLoopRef.current = null
    }
    levelRef.current = 0
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => undefined)
    audioCtxRef.current = null
  }, [])

  const stopRecorder = useCallback((): Promise<Blob | null> => {
    const recorder = recorderRef.current
    if (!recorder || recorder.state !== 'recording') {
      return Promise.resolve(audioBlobRef.current)
    }
    return new Promise<Blob | null>((resolve) => {
      recorder.addEventListener(
        'stop',
        () => resolve(audioBlobRef.current),
        { once: true },
      )
      recorder.stop()
    })
  }, [])

  const runRagQuery = useCallback((queryText: string) => {
    cancelledRef.current = false
    setQueryError(null)
    setResult(null)
    setState('retrieving')

    api
      .ragQuery({ query: queryText })
      .then((res) => {
        if (cancelledRef.current) return
        setState('generating')
        if (res.ok && res.data) {
          setResult(res.data)
          setState('completed')
        } else {
          setQueryError(res.error ?? 'Query failed')
          setState('idle')
        }
      })
      .catch(() => {
        if (cancelledRef.current) return
        setQueryError('Query failed')
        setState('idle')
      })
  }, [])

  const startListening = useCallback(async () => {
    cancelledRef.current = true
    setError('none')
    setTranscript(null)
    setResult(null)
    setQueryError(null)
    audioBlobRef.current = null

    const AudioCtx = getAudioContext()
    if (!AudioCtx) {
      setError('unavailable')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      cancelledRef.current = false
      streamRef.current = stream

      const audioCtx = new AudioCtx()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.75
      source.connect(analyser)

      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioBlobRef.current = event.data
      }
      recorder.start()

      setState('listening')

      const frequencyData = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(frequencyData)
        let sum = 0
        for (let i = 0; i < frequencyData.length; i += 1) sum += frequencyData[i]
        const raw = sum / frequencyData.length / 255
        levelRef.current = levelRef.current * 0.65 + raw * 0.35
        levelLoopRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch (err) {
      setError(toErrorKind(err))
      setState('idle')
    }
  }, [])

  const stopListening = useCallback(() => {
    if (stateRef.current !== 'listening') return
    cancelledRef.current = false
    setState('transcribing')
    stopCapture()

    void stopRecorder().then((blob) => {
      if (cancelledRef.current) return
      const engine = getVoiceEngine()

      if (engine && blob) {
        engine
          .transcribe({ audio: blob, language: languageRef.current })
          .then((transcription) => {
            if (cancelledRef.current) return
            if (transcription.ok && transcription.text) {
              setTranscript(transcription.text)
              runRagQuery(transcription.text)
            } else {
              setError('connection')
              setState('idle')
            }
          })
          .catch(() => {
            if (cancelledRef.current) return
            setError('connection')
            setState('idle')
          })
        return
      }

      setQueryError('Voice engine is not connected.')
      setState('idle')
    })
  }, [runRagQuery, stopCapture, stopRecorder])

  const clear = useCallback(() => {
    cancelledRef.current = true
    stopCapture()
    setState('idle')
    setTranscript(null)
    setResult(null)
    setQueryError(null)
    setError('none')
    audioBlobRef.current = null
  }, [stopCapture])

  const dismissError = useCallback(() => {
    setError('none')
    setState('idle')
  }, [])

  const changeLanguage = useCallback((next: VoiceLanguage) => {
    setLanguage(next)
  }, [])

  useEffect(() => {
    return () => {
      cancelledRef.current = true
      stopCapture()
    }
  }, [stopCapture])

  return {
    state,
    error,
    language,
    transcript,
    result,
    queryError,
    isListening: state === 'listening',
    levelRef,
    startListening,
    stopListening,
    clear,
    setLanguage: changeLanguage,
    dismissError,
  }
}