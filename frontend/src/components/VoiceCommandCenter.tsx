import {
  AudioLines,
  Check,
  CircleCheckBig,
  LoaderCircle,
  Mic,
  Radio,
  SquareStop,
  Trash2,
  WifiOff,
  X,
} from 'lucide-react'
import { Fragment } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useBackendStatus } from '../hooks/useBackendStatus'
import { useVoiceSession } from '../hooks/useVoiceSession'
import { VOICE_LANGUAGES } from '../lib/voice/types'
import type { VoiceErrorKind, VoiceState } from '../lib/voice/types'
import { cn } from '../lib/utils'
import VoiceWaveform from './VoiceWaveform'

const PIPELINE_STEPS = ['Voice', 'STT', 'Retrieval', 'Generation', 'Answer']

const STAGE_BY_STATE: Record<VoiceState, number> = {
  idle: 0,
  listening: 0,
  transcribing: 1,
  retrieving: 2,
  generating: 3,
  completed: 4,
}

const MIC_LABEL: Record<VoiceState, string> = {
  idle: 'Tap to Speak',
  listening: 'Listening...',
  transcribing: 'Transcribing...',
  retrieving: 'Searching Knowledge...',
  generating: 'Generating Grounded Answer...',
  completed: 'Answer Ready',
}

const MIC_HINT: Record<VoiceState, string> = {
  idle: 'Tap the microphone to begin.',
  listening: 'Tap again to stop and run the pipeline.',
  transcribing: 'Converting your speech to text...',
  retrieving: 'Searching the knowledge base...',
  generating: 'Preparing a grounded answer...',
  completed: 'Session complete — tap to ask again.',
}

const TRANSCRIPT_HINT: Record<VoiceState, string> = {
  idle: 'Your spoken question will stream here once transcription connects.',
  listening: 'Listening — speak now.',
  transcribing: 'Converting speech to text...',
  retrieving: 'Searching the knowledge base...',
  generating: 'Preparing a grounded answer...',
  completed: 'Session complete.',
}

const ERROR_CONTENT: Record<
  Exclude<VoiceErrorKind, 'none'>,
  { title: string; description: string; icon: LucideIcon }
> = {
  permission: {
    title: 'Microphone permission required',
    description:
      'Allow microphone access in your browser to enable voice input, then try again.',
    icon: Mic,
  },
  unavailable: {
    title: 'Microphone unavailable',
    description:
      'No working microphone was detected. Check your device and try again.',
    icon: SquareStop,
  },
  connection: {
    title: 'Connection error',
    description:
      'Could not reach the voice engine. Check your connection and try again.',
    icon: WifiOff,
  },
}

export default function VoiceCommandCenter({ className }: { className?: string }) {
  const {
    state,
    error,
    language,
    transcript,
    result,
    queryError,
    isListening,
    levelRef,
    startListening,
    stopListening,
    clear,
    setLanguage,
    dismissError,
  } = useVoiceSession()

  const busy = state === 'transcribing' || state === 'retrieving' || state === 'generating'
  const currentStage = STAGE_BY_STATE[state]

  const { status: backendStatus, loading: backendLoading } = useBackendStatus()
  const voiceEngine =
    backendLoading || backendStatus === 'unconnected'
      ? 'connecting'
      : backendStatus === 'offline'
        ? 'unavailable'
        : 'ready'

  const handleMicClick = () => {
    if (busy) return
    if (state === 'listening') {
      stopListening()
    } else {
      void startListening()
    }
  }

  const micAriaLabel =
    state === 'listening'
      ? 'Stop listening'
      : busy
        ? 'Processing query'
        : 'Start voice input'

  return (
    <section
      className={cn(
        'glass card-hover relative overflow-hidden rounded-3xl p-5 sm:p-8 animate-rise',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -top-28 -right-28 size-80 rounded-full bg-violet-accent/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-cyan-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="rounded-xl bg-cyan-accent/10 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/20"
              aria-hidden="true"
            >
              <Mic className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight text-white">
                Voice Command Center
              </h2>
              <p className="text-[13px] text-slate-400">
                Ask a question with your voice — multilingual, voice-first.
              </p>
            </div>
          </div>

          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
              voiceEngine === 'ready'
                ? 'border-emerald-400/25 bg-emerald-400/10'
                : voiceEngine === 'unavailable'
                  ? 'border-rose-400/25 bg-rose-500/10'
                  : 'border-white/10 bg-white/5',
            )}
            role="status"
            aria-live="polite"
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                voiceEngine === 'ready'
                  ? 'bg-emerald-400 animate-pulse-dot'
                  : voiceEngine === 'unavailable'
                    ? 'bg-rose-500'
                    : 'bg-slate-400 animate-pulse-dot',
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                'text-[10px] font-semibold tracking-widest uppercase',
                voiceEngine === 'ready'
                  ? 'text-emerald-300'
                  : voiceEngine === 'unavailable'
                    ? 'text-rose-300'
                    : 'text-slate-400',
              )}
            >
              Voice Engine
            </span>
            <span className="text-[10px] text-slate-400/70">·</span>
            <span
              className={cn(
                'text-[10px] font-semibold',
                voiceEngine === 'ready'
                  ? 'text-emerald-300'
                  : voiceEngine === 'unavailable'
                    ? 'text-rose-300'
                    : 'text-slate-400',
              )}
            >
              {voiceEngine === 'ready'
                ? 'Ready'
                : voiceEngine === 'unavailable'
                  ? 'Unavailable'
                  : 'Connecting'}
            </span>
          </div>
        </header>

        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
          role="group"
          aria-label="Voice language"
        >
          {VOICE_LANGUAGES.map((option) => {
            const isActive = option.id === language
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setLanguage(option.id)}
                aria-pressed={isActive}
                className={cn(
                  'focus-ring inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                  isActive
                    ? 'border-cyan-accent/40 bg-cyan-accent/10 text-cyan-accent shadow-sm shadow-cyan-accent/10'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200',
                )}
              >
                {isActive && <Check className="size-3" aria-hidden="true" />}
                {option.label}
                <span className="hidden text-[10px] text-slate-500 sm:inline">
                  {option.hint}
                </span>
              </button>
            )
          })}
        </div>

        <ol
          className="mt-8 flex items-center"
          aria-label="Voice pipeline stages"
        >
          {PIPELINE_STEPS.map((step, index) => {
            const isDone = index < currentStage
            const isActive = index === currentStage
            return (
              <Fragment key={step}>
                <li
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-500',
                    isActive
                      ? 'border-transparent bg-gradient-to-br from-cyan-accent to-violet-accent text-night-950 shadow-lg shadow-violet-accent/30'
                      : isDone
                        ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-slate-500',
                  )}
                >
                  {isDone ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </li>
                {index < PIPELINE_STEPS.length - 1 && (
                  <li
                    className={cn(
                      'h-0.5 flex-1 rounded-full transition-colors duration-500',
                      isDone ? 'bg-emerald-400/40' : 'bg-white/10',
                    )}
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            )
          })}
        </ol>
        <div className="mt-1.5 flex">
          {PIPELINE_STEPS.map((step, index) => (
            <span
              key={step}
              className={cn(
                'flex-1 text-center text-[10px] font-medium transition-colors',
                index === currentStage
                  ? 'text-cyan-accent'
                  : index < currentStage
                    ? 'text-emerald-300'
                    : 'text-slate-500',
              )}
            >
              {step}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative size-[240px] scale-90 sm:scale-100">
            <VoiceWaveform active={isListening} levelRef={levelRef} />

            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center rounded-full blur-2xl transition-colors duration-700',
                isListening
                  ? 'bg-cyan-accent/25'
                  : busy
                    ? 'bg-violet-accent/25'
                    : state === 'completed'
                      ? 'bg-emerald-400/20'
                      : 'bg-cyan-accent/10',
              )}
              aria-hidden="true"
            />

            {isListening && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="size-[118px] rounded-full border border-cyan-accent/40 animate-ring-pulse" />
              </div>
            )}

            {busy && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="size-[118px] rounded-full border-2 border-transparent border-t-violet-soft animate-spin" />
              </div>
            )}

            <button
              type="button"
              onClick={handleMicClick}
              disabled={busy}
              aria-label={micAriaLabel}
              className={cn(
                'focus-ring absolute top-1/2 left-1/2 flex size-[104px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500',
                state === 'idle' &&
                  'border border-cyan-accent/30 bg-gradient-to-br from-cyan-accent/20 to-violet-accent/20 text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:scale-105 hover:shadow-[0_0_45px_rgba(34,211,238,0.55)]',
                isListening &&
                  'border border-cyan-accent/60 bg-gradient-to-br from-cyan-accent/30 to-violet-accent/30 text-white shadow-[0_0_45px_rgba(34,211,238,0.6)]',
                busy &&
                  'border border-violet-soft/40 bg-gradient-to-br from-violet-accent/25 to-cyan-accent/25 text-white',
                state === 'completed' &&
                  'border border-emerald-400/40 bg-gradient-to-br from-emerald-400/25 to-cyan-accent/20 text-emerald-200 shadow-[0_0_35px_rgba(52,211,153,0.4)]',
              )}
            >
              {busy ? (
                <LoaderCircle className="size-9 animate-spin" aria-hidden="true" />
              ) : isListening ? (
                <Mic className="size-9" aria-hidden="true" />
              ) : state === 'completed' ? (
                <CircleCheckBig className="size-9" aria-hidden="true" />
              ) : (
                <Mic className="size-9" aria-hidden="true" />
              )}
              {isListening && (
                <span
                  className="absolute top-1 right-1 size-3 rounded-full bg-rose-500 animate-pulse"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>

          <p className="mt-5 font-display text-base font-semibold tracking-tight text-white">
            {MIC_LABEL[state]}
          </p>
          <p className="mt-1 min-h-4 text-center text-xs text-slate-500">
            {MIC_HINT[state]}
          </p>
        </div>

        {error !== 'none' && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-500/10 p-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="rounded-lg bg-rose-500/15 p-2 text-rose-300"
                aria-hidden="true"
              >
                {(() => {
                  const ErrIcon = ERROR_CONTENT[error].icon
                  return <ErrIcon className="size-4" />
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-rose-200">
                  {ERROR_CONTENT[error].title}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-rose-200/70">
                  {ERROR_CONTENT[error].description}
                </p>
              </div>
              <button
                type="button"
                onClick={dismissError}
                className="focus-ring rounded-lg p-1.5 text-rose-300/70 transition-colors hover:bg-rose-500/15 hover:text-rose-200"
                aria-label="Dismiss error"
              >
                <X className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                dismissError()
                void startListening()
              }}
              className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-xl border border-rose-300/30 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/25"
            >
              <Mic className="size-3.5" aria-hidden="true" />
              Try Again
            </button>
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-night-950/50 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-300">
              <AudioLines className="size-3.5 text-cyan-accent" aria-hidden="true" />
              Live Transcript
            </div>
            <button
              type="button"
              onClick={clear}
              disabled={state === 'idle' && !transcript}
              className={cn(
                'focus-ring inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors',
                state === 'idle' && !transcript
                  ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200',
              )}
            >
              <Trash2 className="size-3" aria-hidden="true" />
              Clear
            </button>
          </div>
          <div className="px-4 py-8 sm:px-6">
            {queryError ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex size-12 items-center justify-center rounded-full border border-rose-400/25 bg-rose-500/10">
                  <WifiOff className="size-5 text-rose-300" aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm font-medium text-rose-200">
                  Query could not be processed
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  {queryError}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                    Query
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-200">
                    {result.query}
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-accent/15 bg-cyan-accent/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                      Result
                    </p>
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold',
                        result.grounded
                          ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
                          : 'border-amber-400/25 bg-amber-400/10 text-amber-300',
                      )}
                    >
                      {result.grounded ? 'Grounded' : 'Not grounded'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                    {result.answer ?? 'No answer produced'}
                  </p>
                  {result.guardrail_reason && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {result.guardrail_reason}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg border border-white/10 bg-night-950/50 px-3 py-2">
                    <p className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
                      Evidence
                    </p>
                    <p className="mt-0.5 font-mono text-[13px] text-slate-200">
                      {result.evidence_count}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-night-950/50 px-3 py-2">
                    <p className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
                      Retrieval
                    </p>
                    <p className="mt-0.5 font-mono text-[13px] text-slate-200">
                      {result.retrieval_ms != null ? `${result.retrieval_ms} ms` : '--'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-night-950/50 px-3 py-2">
                    <p className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
                      Rerank
                    </p>
                    <p className="mt-0.5 font-mono text-[13px] text-slate-200">
                      {result.rerank_ms != null ? `${result.rerank_ms} ms` : '--'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-night-950/50 px-3 py-2">
                    <p className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
                      Total
                    </p>
                    <p className="mt-0.5 font-mono text-[13px] text-slate-200">
                      {result.total_ms != null ? `${result.total_ms} ms` : '--'}
                    </p>
                  </div>
                </div>
              </div>
            ) : busy ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex size-12 items-center justify-center rounded-full border border-cyan-accent/30 bg-cyan-accent/10">
                  <LoaderCircle className="size-5 text-cyan-accent animate-spin" aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-300">
                  {state === 'generating'
                    ? 'Preparing answer...'
                    : 'Running the RAG pipeline...'}
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  Querying POST /api/query for a grounded answer.
                </p>
              </div>
            ) : transcript ? (
              <p className="text-sm leading-relaxed text-slate-200">{transcript}</p>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className={cn(
                    'flex size-12 items-center justify-center rounded-full border transition-colors duration-500',
                    isListening
                      ? 'border-cyan-accent/30 bg-cyan-accent/10'
                      : 'border-white/10 bg-white/5',
                  )}
                >
                  {isListening ? (
                    <Radio
                      className="size-5 text-cyan-accent animate-pulse"
                      aria-hidden="true"
                    />
                  ) : (
                    <AudioLines className="size-5 text-slate-500" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-4 text-sm font-medium text-slate-300">
                  Your question will appear here...
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  {TRANSCRIPT_HINT[state]}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-600">
          Audio is captured locally for the waveform · STT runs through{' '}
          <code className="font-mono text-cyan-accent/70">
            POST /api/stt
          </code>
          {' '}and answers through{' '}
          <code className="font-mono text-cyan-accent/70">
            POST /api/query
          </code>
        </p>
      </div>
    </section>
  )
}