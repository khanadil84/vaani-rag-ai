import { Gauge, WifiOff } from 'lucide-react'
import { useState } from 'react'
import { BENCHMARK_QUERY_OPTIONS } from '../lib/latency/stages'
import { cn } from '../lib/utils'

interface BenchmarkControlsProps {
  className?: string
}

export default function BenchmarkControls({ className }: BenchmarkControlsProps) {
  const [queryCount, setQueryCount] = useState<number>(
    BENCHMARK_QUERY_OPTIONS[0],
  )
  const [attempted, setAttempted] = useState(false)

  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">
          Test Queries
        </h2>
        <p className="mt-0.5 text-[13px] text-slate-400">
          Queue a benchmark run against the full voice RAG pipeline.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Test query count">
        {BENCHMARK_QUERY_OPTIONS.map((option) => {
          const isActive = option === queryCount
          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                setQueryCount(option)
                setAttempted(false)
              }}
              aria-pressed={isActive}
              className={cn(
                'focus-ring rounded-xl border px-4 py-2 font-mono text-sm font-semibold transition-all',
                isActive
                  ? 'border-cyan-accent/40 bg-cyan-accent/10 text-cyan-accent shadow-sm shadow-cyan-accent/10'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200',
              )}
            >
              {option}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setAttempted(true)}
        className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-accent/90 to-violet-accent/80 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-accent/20 transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        <Gauge className="size-4" aria-hidden="true" />
        Run Benchmark
      </button>

      <div aria-live="polite">
        {attempted && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4">
            <div
              className="rounded-lg bg-amber-400/15 p-2 text-amber-300"
              aria-hidden="true"
            >
              <WifiOff className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-200">
                Benchmark backend not connected
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-amber-200/70">
                No queries were run. The benchmark will execute once the
                latency backend streams real measurements.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}