import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface GuardrailExampleCardProps {
  tag: string
  tagAccent: 'saffron' | 'cyan' | 'violet'
  title: string
  message: string
  icon: LucideIcon
  actions: string[]
  className?: string
}

const TAG_ACCENTS: Record<string, string> = {
  saffron: 'border-saffron-accent/30 bg-saffron-accent/10 text-saffron-accent',
  cyan: 'border-cyan-accent/30 bg-cyan-accent/10 text-cyan-accent',
  violet: 'border-violet-soft/30 bg-violet-accent/10 text-violet-soft',
}

export default function GuardrailExampleCard({
  tag,
  tagAccent,
  title,
  message,
  icon: Icon,
  actions,
  className,
}: GuardrailExampleCardProps) {
  return (
    <article
      className={cn(
        'glass card-hover flex flex-col rounded-2xl border-dashed p-5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-widest uppercase',
            TAG_ACCENTS[tagAccent],
          )}
        >
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          {tag}
        </span>
        <div
          className="rounded-xl bg-gradient-to-br from-cyan-accent/15 to-violet-accent/15 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/20"
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>
      </div>

      <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-300">
        "{message}"
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-accent/30 hover:bg-white/10"
          >
            {action}
          </button>
        ))}
      </div>
    </article>
  )
}