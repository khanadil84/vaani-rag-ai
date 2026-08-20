import { Hourglass } from 'lucide-react'
import { ANSWER_DECISIONS } from '../lib/safety/config'
import type { AnswerDecision } from '../lib/safety/types'
import { cn } from '../lib/utils'

const DECISION_DISPLAY: Record<
  AnswerDecision,
  { title: string; description: string }
> = {
  waiting: {
    title: 'Waiting for query',
    description: 'The answer decision will appear here once a query is evaluated.',
  },
  answer: {
    title: 'Answer',
    description: 'The query is safe, grounded and ready to be answered.',
  },
  refuse: {
    title: 'Refuse',
    description: 'The system refused to answer this query.',
  },
  'insufficient-context': {
    title: 'Insufficient Context',
    description: 'Not enough retrieved evidence to answer reliably.',
  },
  'unsafe-query': {
    title: 'Unsafe Query',
    description: 'The query was blocked by the safety check.',
  },
  'off-topic': {
    title: 'Off-topic',
    description: 'The query is outside the knowledge base scope.',
  },
  error: {
    title: 'Error',
    description: 'The trust pipeline encountered an error.',
  },
}

interface AnswerDecisionCardProps {
  decision?: AnswerDecision
  className?: string
}

export default function AnswerDecisionCard({
  decision = 'waiting',
  className,
}: AnswerDecisionCardProps) {
  const display = DECISION_DISPLAY[decision]

  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          Answer Decision
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-400">
          How VaaniRAG AI decides to answer, refuse, or request more context.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-night-950/50 px-6 py-10 text-center">
        <div className="relative" aria-hidden="true">
          <span className="absolute -inset-3 rounded-full border border-dashed border-cyan-accent/25 animate-spin-slow" />
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-accent/20 to-violet-accent/20 text-cyan-accent ring-1 ring-cyan-accent/25">
            {decision === 'waiting' ? (
              <Hourglass className="size-8 animate-pulse" />
            ) : (
              <Hourglass className="size-8" />
            )}
          </div>
        </div>
        <p className="mt-6 font-display text-xl font-semibold tracking-tight text-white">
          {display.title}
        </p>
        <p className="mt-1 max-w-md text-[13px] leading-relaxed text-slate-500">
          {display.description}
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Possible decisions
        </p>
        <div className="flex flex-wrap gap-2">
          {ANSWER_DECISIONS.map((item) => {
            const Icon = item.icon
            const isActive = item.id === decision
            return (
              <span
                key={item.id}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors',
                  isActive
                    ? 'border-cyan-accent/40 bg-cyan-accent/10 text-cyan-accent'
                    : 'border-white/10 bg-white/5 text-slate-400',
                )}
              >
                <Icon className="size-3" aria-hidden="true" />
                {item.label}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}