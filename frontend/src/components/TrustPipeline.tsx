import { ShieldCheck } from 'lucide-react'
import { Fragment } from 'react'
import { TRUST_PIPELINE } from '../lib/safety/config'
import { cn } from '../lib/utils'
import NeutralStatusBadge from './NeutralStatusBadge'

interface TrustPipelineProps {
  className?: string
}

export default function TrustPipeline({ className }: TrustPipelineProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Trust Pipeline
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Every decision stage between the query and the final response.
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-400"
          role="status"
        >
          <ShieldCheck className="size-3 text-cyan-accent" aria-hidden="true" />
          Waiting for query
        </span>
      </div>

      <ol className="mx-auto max-w-3xl">
        {TRUST_PIPELINE.map((stage, index) => {
          const Icon = stage.icon
          const isLast = index === TRUST_PIPELINE.length - 1
          return (
            <Fragment key={stage.id}>
              <li className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-night-800 text-cyan-accent ring-1 ring-cyan-accent/20"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="truncate text-sm font-semibold text-white">
                      {stage.name}
                    </h3>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {stage.description}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  <code className="font-mono text-[12px] text-slate-400">-- ms</code>
                  <NeutralStatusBadge label="Not measured" />
                </div>
                <NeutralStatusBadge label="Not measured" className="shrink-0 sm:hidden" />
              </li>
              {!isLast && (
                <div
                  className="relative mx-auto my-1 h-6 w-px bg-gradient-to-b from-white/15 to-white/5"
                  aria-hidden="true"
                >
                  <span
                    className="absolute top-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-cyan-accent/70 shadow-[0_0_6px_rgba(34,211,238,0.9)] animate-flow-y"
                    style={{ animationDelay: `${index * 0.3}s` }}
                  />
                </div>
              )}
            </Fragment>
          )
        })}
      </ol>
    </section>
  )
}