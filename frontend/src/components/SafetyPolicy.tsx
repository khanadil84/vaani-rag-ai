import { ShieldCheck } from 'lucide-react'
import { SAFETY_PRINCIPLES } from '../lib/safety/config'
import { cn } from '../lib/utils'

interface SafetyPolicyProps {
  className?: string
}

export default function SafetyPolicy({ className }: SafetyPolicyProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div
          className="rounded-xl bg-saffron-accent/10 p-2.5 text-saffron-accent ring-1 ring-saffron-accent/20"
          aria-hidden="true"
        >
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Safety Policy
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            The principles every response must follow.
          </p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {SAFETY_PRINCIPLES.map((principle) => {
          const Icon = principle.icon
          return (
            <li
              key={principle.text}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 transition-colors hover:border-white/20"
            >
              <div
                className="rounded-lg bg-cyan-accent/10 p-1.5 text-cyan-accent"
                aria-hidden="true"
              >
                <Icon className="size-3.5" />
              </div>
              <p className="text-[13px] leading-snug text-slate-200">
                {principle.text}
              </p>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        These are product design principles, not measured results.
      </p>
    </section>
  )
}