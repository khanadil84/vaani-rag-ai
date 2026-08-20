import { Fragment } from 'react'
import { RETRIEVAL_FLOW } from '../lib/retrieval/strategies'
import { cn } from '../lib/utils'

interface RetrievalFlowProps {
  className?: string
}

export default function RetrievalFlow({ className }: RetrievalFlowProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          Retrieval Flow
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-400">
          The path from query to context set.
        </p>
      </div>

      <ol className="flex items-stretch gap-2 overflow-x-auto pb-1 lg:overflow-visible">
        {RETRIEVAL_FLOW.map((stage, index) => {
          const Icon = stage.icon
          const isLast = index === RETRIEVAL_FLOW.length - 1
          return (
            <Fragment key={stage.id}>
              <li className="flex min-w-[150px] flex-1 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition-colors hover:border-white/20">
                <div
                  className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-accent/15 to-violet-accent/15 text-cyan-accent ring-1 ring-cyan-accent/20"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{stage.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
                    {stage.detail}
                  </p>
                </div>
              </li>
              {!isLast && (
                <li
                  className="relative hidden w-5 shrink-0 self-center sm:block"
                  aria-hidden="true"
                >
                  <span className="absolute top-1/2 left-0 h-px w-full bg-gradient-to-r from-white/20 to-white/10" />
                  <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-accent/70" />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </section>
  )
}