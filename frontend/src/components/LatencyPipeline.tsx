import { Activity } from 'lucide-react'
import { LATENCY_STAGES } from '../lib/latency/stages'
import { cn } from '../lib/utils'

interface LatencyPipelineProps {
  className?: string
}

export default function LatencyPipeline({ className }: LatencyPipelineProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Pipeline Latency
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Per-stage measurement points across the full voice RAG pipeline.
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-400"
          role="status"
        >
          <Activity className="size-3 text-cyan-accent" aria-hidden="true" />
          Waiting for measurements
        </span>
      </div>

      <ol className="flex gap-3 overflow-x-auto pb-2">
        {LATENCY_STAGES.map((stage, index) => {
          const Icon = stage.icon
          return (
            <li
              key={stage.id}
              className="flex min-w-[168px] flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-accent/15 to-violet-accent/15 text-cyan-accent ring-1 ring-cyan-accent/20"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
                <span className="font-mono text-[10px] text-slate-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{stage.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">{stage.tagline}</p>
              <div className="mt-3 flex items-center justify-between">
                <code className="font-mono text-[13px] text-slate-400">-- ms</code>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
                  Waiting
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}