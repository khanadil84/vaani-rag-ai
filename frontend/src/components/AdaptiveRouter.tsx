import { CornerDownRight } from 'lucide-react'
import { Fragment } from 'react'
import {
  getStrategyName,
  ROUTER_STEPS,
  ROUTING_EXAMPLES,
} from '../lib/retrieval/strategies'
import { cn } from '../lib/utils'

interface AdaptiveRouterProps {
  className?: string
}

export default function AdaptiveRouter({ className }: AdaptiveRouterProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          Adaptive Router
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-400">
          Decides which retrieval path a query takes — routed per query.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          {ROUTER_STEPS.map((step, index) => {
            const Icon = step.icon
            const isLast = index === ROUTER_STEPS.length - 1
            return (
              <Fragment key={step.label}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-night-800 text-cyan-accent ring-1 ring-cyan-accent/20"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-semibold tracking-widest text-cyan-accent">
                      {step.label}
                    </p>
                    <p className="text-[11px] text-slate-500">{step.detail}</p>
                  </div>
                </div>
                {!isLast && (
                  <div
                    className="relative mx-auto my-1 h-6 w-px bg-gradient-to-b from-white/15 to-white/5"
                    aria-hidden="true"
                  >
                    <span
                      className="absolute top-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-violet-soft/70 shadow-[0_0_6px_rgba(167,139,250,0.9)] animate-flow-y"
                      style={{ animationDelay: `${index * 0.35}s` }}
                    />
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Example routing reasons
            </p>
            <span className="rounded-full border border-saffron-accent/30 bg-saffron-accent/10 px-2.5 py-1 text-[9px] font-semibold tracking-widest text-saffron-accent uppercase">
              Templates
            </span>
          </div>

          <ul className="space-y-2.5">
            {ROUTING_EXAMPLES.map((example) => (
              <li
                key={example.queryType}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-white/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-slate-200">
                    {example.queryType}
                  </p>
                  <span className="rounded-full border border-cyan-accent/25 bg-cyan-accent/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-accent">
                    {getStrategyName(example.strategy)}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] italic text-slate-500">
                  "{example.exampleQuery}"
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[11px] text-slate-500">
            <CornerDownRight
              className="size-3.5 shrink-0 text-saffron-accent/70"
              aria-hidden="true"
            />
            <span className="leading-snug">
              Routing templates only — the router is not active until the
              retrieval backend streams decisions.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}