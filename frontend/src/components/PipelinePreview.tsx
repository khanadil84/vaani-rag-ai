import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  FlaskConical,
  Mic,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '../lib/utils'
import type { RouteId } from '../types'

const STAGES = [
  {
    icon: Mic,
    label: 'Voice',
    detail: 'Audio capture',
    accent: 'text-cyan-accent bg-cyan-accent/10 ring-cyan-accent/20',
  },
  {
    icon: AudioLines,
    label: 'Speech-to-Text',
    detail: 'Transcribe query',
    accent: 'text-violet-soft bg-violet-accent/10 ring-violet-accent/20',
  },
  {
    icon: FlaskConical,
    label: 'Adaptive Retrieval',
    detail: 'Context search',
    accent: 'text-violet-soft bg-violet-accent/10 ring-violet-accent/20',
  },
  {
    icon: Sparkles,
    label: 'Grounded Generation',
    detail: 'Answer with sources',
    accent: 'text-cyan-accent bg-cyan-accent/10 ring-cyan-accent/20',
  },
  {
    icon: ShieldCheck,
    label: 'Trust & Safety',
    detail: 'Guardrails',
    accent: 'text-saffron-accent bg-saffron-accent/10 ring-saffron-accent/20',
  },
  {
    icon: BadgeCheck,
    label: 'Answer',
    detail: 'Final response',
    accent: 'text-saffron-accent bg-saffron-accent/10 ring-saffron-accent/20',
  },
]

interface PipelinePreviewProps {
  className?: string
  onNavigate?: (id: RouteId) => void
}

export default function PipelinePreview({
  className,
  onNavigate,
}: PipelinePreviewProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold tracking-tight text-white">
            Voice → Grounded Answer
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            From spoken question to trusted answer — through speech-to-text,
            adaptive retrieval, grounded generation and safety guardrails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-400 sm:inline-flex">
            End-to-end · API-ready
          </span>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('rag-pipeline')}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-cyan-accent/30 bg-cyan-accent/10 px-3 py-1 text-[11px] font-semibold text-cyan-accent transition-colors hover:bg-cyan-accent/15"
            >
              Open pipeline
              <ArrowRight className="size-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon
          return (
            <li key={stage.label} className="relative">
              <div
                className={cn(
                  'flex h-full flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4',
                  'transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25',
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={cn('rounded-lg p-2 ring-1', stage.accent)}
                    aria-hidden="true"
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-600">
                    0{index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{stage.label}</p>
                  <p className="text-[11px] text-slate-500">{stage.detail}</p>
                </div>
              </div>
              {index < STAGES.length - 1 && (
                <span
                  className="pointer-events-none absolute top-1/2 -right-2.5 z-10 hidden h-px w-5 bg-gradient-to-r from-slate-600 to-slate-700 xl:block"
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}