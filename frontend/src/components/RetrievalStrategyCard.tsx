import type { RetrievalStrategyConfig } from '../lib/retrieval/types'
import { cn } from '../lib/utils'

function PlaceholderStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-night-950/50 px-3 py-2">
      <p className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[13px] text-slate-300">{value}</p>
    </div>
  )
}

interface RetrievalStrategyCardProps {
  strategy: RetrievalStrategyConfig
  className?: string
}

export default function RetrievalStrategyCard({
  strategy,
  className,
}: RetrievalStrategyCardProps) {
  const Icon = strategy.icon
  const chunkSize = strategy.chunkSize !== null ? String(strategy.chunkSize) : '--'
  const overlap = strategy.overlap !== null ? String(strategy.overlap) : '--'
  const documents = strategy.documents !== null ? String(strategy.documents) : '--'

  return (
    <article className={cn('glass card-hover rounded-2xl p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div
          className="rounded-xl bg-gradient-to-br from-cyan-accent/15 to-violet-accent/15 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/20"
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-soft/25 bg-violet-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-violet-soft uppercase">
          <span className="size-1.5 rounded-full bg-violet-soft" aria-hidden="true" />
          {strategy.status}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-white">
        {strategy.name}
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
        {strategy.explanation}
      </p>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
        <span className="font-semibold text-slate-400">Best use:</span>
        <span className="truncate">{strategy.bestUse}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <PlaceholderStat label="Chunk size" value={chunkSize} />
        <PlaceholderStat label="Overlap" value={overlap} />
        <PlaceholderStat label="Documents" value={documents} />
      </div>
    </article>
  )
}