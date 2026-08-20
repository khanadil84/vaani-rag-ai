import { Radius } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface Percentile {
  label: string
  icon: LucideIcon
  caption: string
  accent: 'cyan' | 'violet' | 'saffron'
}

const PERCENTILES: Percentile[] = [
  {
    label: 'P50',
    icon: Radius,
    caption: 'Median pipeline latency',
    accent: 'cyan',
  },
  {
    label: 'P70',
    icon: Radius,
    caption: '70th percentile latency',
    accent: 'violet',
  },
  {
    label: 'P100',
    icon: Radius,
    caption: 'Worst-case latency',
    accent: 'saffron',
  },
]

const ACCENTS: Record<string, string> = {
  cyan: 'text-cyan-accent bg-cyan-accent/10 ring-cyan-accent/20',
  violet: 'text-violet-soft bg-violet-accent/10 ring-violet-accent/20',
  saffron: 'text-saffron-accent bg-saffron-accent/10 ring-saffron-accent/20',
}

interface LatencyDistributionProps {
  className?: string
}

export default function LatencyDistribution({ className }: LatencyDistributionProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          Latency Distribution
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-400">
          Percentile spread of pipeline latency across benchmark runs.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {PERCENTILES.map((percentile) => {
          const Icon = percentile.icon
          return (
            <article
              key={percentile.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'rounded-lg p-2 ring-1',
                    ACCENTS[percentile.accent],
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </span>
                <span
                  className={cn(
                    'font-mono text-[11px] font-semibold',
                    percentile.accent === 'cyan'
                      ? 'text-cyan-accent'
                      : percentile.accent === 'violet'
                        ? 'text-violet-soft'
                        : 'text-saffron-accent',
                  )}
                >
                  {percentile.label}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-white">
                -- ms
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">{percentile.caption}</p>

              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-accent to-violet-accent" />
                </div>
                <p className="mt-2 text-center font-mono text-[9px] tracking-widest text-slate-600 uppercase">
                  Not measured
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}