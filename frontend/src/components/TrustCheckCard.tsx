import type { TrustCheckConfig } from '../lib/safety/config'
import { cn } from '../lib/utils'
import NeutralStatusBadge from './NeutralStatusBadge'

interface TrustCheckCardProps {
  check: TrustCheckConfig
  className?: string
}

export default function TrustCheckCard({
  check,
  className,
}: TrustCheckCardProps) {
  const Icon = check.icon
  return (
    <article className={cn('glass card-hover rounded-2xl p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div
          className="rounded-xl bg-gradient-to-br from-cyan-accent/15 to-violet-accent/15 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/20"
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>
        <NeutralStatusBadge label="Not measured" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-white">{check.name}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
        {check.description}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Latency
        </span>
        <code className="font-mono text-[12px] text-slate-400">-- ms</code>
      </div>
    </article>
  )
}