import { BadgeCheck, Braces, CircleCheck, ScanSearch, Waypoints } from 'lucide-react'
import { Fragment } from 'react'
import { cn } from '../lib/utils'
import NeutralStatusBadge from './NeutralStatusBadge'

const GROUNDING_STEPS = [
  { label: 'Answer', icon: BadgeCheck, detail: 'Draft answer' },
  { label: 'Retrieved Context', icon: ScanSearch, detail: 'Evidence set' },
  { label: 'Evidence Matching', icon: Braces, detail: 'Align claims' },
  { label: 'Grounded Decision', icon: CircleCheck, detail: 'Verdict' },
]

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-night-950/50 px-3.5 py-3">
      <p className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg text-slate-300">{value}</p>
    </div>
  )
}

interface GroundingVerificationProps {
  className?: string
}

export default function GroundingVerification({
  className,
}: GroundingVerificationProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Grounding Verification
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Checks that every claim in the answer is supported by evidence.
          </p>
        </div>
        <NeutralStatusBadge label="Not measured" />
      </div>

      <ol className="mx-auto max-w-md">
        {GROUNDING_STEPS.map((step, index) => {
          const Icon = step.icon
          const isLast = index === GROUNDING_STEPS.length - 1
          return (
            <Fragment key={step.label}>
              <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-night-800 text-violet-soft ring-1 ring-violet-accent/20"
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-500">{step.detail}</p>
                </div>
              </li>
              {!isLast && (
                <div
                  className="relative mx-auto my-1 h-5 w-px bg-gradient-to-b from-white/15 to-white/5"
                  aria-hidden="true"
                >
                  <span className="absolute top-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-violet-soft/70 shadow-[0_0_6px_rgba(167,139,250,0.9)] animate-flow-y" />
                </div>
              )}
            </Fragment>
          )
        })}
      </ol>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Stat label="Evidence Coverage" value="--" />
        <Stat label="Grounding Score" value="--" />
        <Stat label="Unsupported Claims" value="--" />
      </div>
      <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        <Waypoints className="size-3.5 shrink-0 text-slate-600" aria-hidden="true" />
        Scores are streamed by the guardrail backend when connected.
      </p>
    </section>
  )
}