import { Activity, Gauge, ListChecks, Timer, Zap } from 'lucide-react'
import BenchmarkControls from '../components/BenchmarkControls'
import LatencyChart from '../components/LatencyChart'
import LatencyDistribution from '../components/LatencyDistribution'
import LatencyMetricCard from '../components/LatencyMetricCard'
import LatencyPipeline from '../components/LatencyPipeline'
import PageHeader from '../components/PageHeader'
import { LATENCY_TARGET_MS } from '../lib/latency/stages'
import type { LatencyMeasurement } from '../lib/latency/types'

const EMPTY_MEASUREMENTS: LatencyMeasurement[] = []

// Official VaaniRAG 104-query full-pipeline benchmark.
// These are offline benchmark results, NOT live traffic measurements.
const OFFICIAL_FULL_PIPELINE_BENCHMARK = {
  queries: 104,
  recallAt20: 89.42,
  p50Ms: 65.226,
  p70Ms: 82.551,
  p100Ms: 345.665,
  averageMs: 75.399,
}

export default function LatencyObservatory() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={Gauge}
        eyebrow="Latency Observatory"
        title="Latency Observatory"
        description="Measure every millisecond from voice input to grounded answer."
      />

      <section className="glass card-hover relative animate-rise overflow-hidden rounded-3xl px-6 py-8 text-center sm:py-10 [animation-delay:60ms]">
        <div
          className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-violet-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-24 size-72 rounded-full bg-cyan-accent/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/50 to-transparent"
          aria-hidden="true"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-accent/30 bg-saffron-accent/10 px-3 py-1 text-[10px] font-semibold tracking-widest text-saffron-accent uppercase">
            Target
          </span>

          <p className="mt-4 font-display text-5xl font-semibold tracking-tight text-gradient sm:text-6xl">
            &lt; {LATENCY_TARGET_MS} ms
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Full pipeline latency target
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>0 ms</span>

              <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[9px] font-semibold tracking-widest text-amber-300 uppercase">
                Live not measured
              </span>

              <span>400 ms</span>
            </div>

            <div className="relative h-2 rounded-full bg-white/5">
              <div className="absolute top-0 left-0 h-full w-0 rounded-full bg-gradient-to-r from-cyan-accent to-violet-accent" />

              <div
                className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron-accent"
                style={{ left: '50%' }}
                aria-hidden="true"
              />
            </div>

            <div className="mt-2 flex justify-between font-mono text-[9px] tracking-widest text-slate-600 uppercase">
              <span>Target: {LATENCY_TARGET_MS} ms</span>
              <span>Scale: 400 ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live measurements */}
      <div className="grid animate-rise gap-4 sm:grid-cols-2 lg:grid-cols-4 [animation-delay:120ms]">
        <LatencyMetricCard
          label="Live P50"
          icon={Timer}
          value="--"
          unit="ms"
          caption="No live benchmark run"
          accent="cyan"
        />

        <LatencyMetricCard
          label="Live P70"
          icon={Activity}
          value="--"
          unit="ms"
          caption="No live benchmark run"
          accent="violet"
        />

        <LatencyMetricCard
          label="Live P100"
          icon={Zap}
          value="--"
          unit="ms"
          caption="No live benchmark run"
          accent="saffron"
        />

        <LatencyMetricCard
          label="Live Queries"
          icon={ListChecks}
          value="--"
          unit="queries"
          caption="No live benchmark run"
          accent="violet"
        />
      </div>

      {/* Official benchmark */}
      <section className="glass card-hover animate-rise rounded-3xl p-6 [animation-delay:150ms]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-cyan-accent uppercase">
              Official Benchmark
            </p>

            <h2 className="mt-1 font-display text-2xl font-semibold text-white">
              VaaniRAG 104-Query Full-Pipeline Evaluation
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Offline validated results. These are not live traffic metrics.
            </p>
          </div>

          <span className="w-fit rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold tracking-widest text-emerald-300 uppercase">
            Validated
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <LatencyMetricCard
            label="P50"
            icon={Timer}
            value={OFFICIAL_FULL_PIPELINE_BENCHMARK.p50Ms.toFixed(3)}
            unit="ms"
            caption="Median"
            accent="cyan"
          />

          <LatencyMetricCard
            label="P70"
            icon={Activity}
            value={OFFICIAL_FULL_PIPELINE_BENCHMARK.p70Ms.toFixed(3)}
            unit="ms"
            caption="70th percentile"
            accent="violet"
          />

          <LatencyMetricCard
            label="P100"
            icon={Zap}
            value={OFFICIAL_FULL_PIPELINE_BENCHMARK.p100Ms.toFixed(3)}
            unit="ms"
            caption="Worst case"
            accent="saffron"
          />

          <LatencyMetricCard
            label="Average"
            icon={Gauge}
            value={OFFICIAL_FULL_PIPELINE_BENCHMARK.averageMs.toFixed(3)}
            unit="ms"
            caption="Mean latency"
            accent="cyan"
          />

          <LatencyMetricCard
            label="Queries"
            icon={ListChecks}
            value={String(OFFICIAL_FULL_PIPELINE_BENCHMARK.queries)}
            unit="queries"
            caption={`Recall@20 ${OFFICIAL_FULL_PIPELINE_BENCHMARK.recallAt20}%`}
            accent="violet"
          />
        </div>
      </section>

      <LatencyPipeline className="animate-rise [animation-delay:180ms]" />

      <div className="grid animate-rise gap-6 lg:grid-cols-2 [animation-delay:240ms]">
        <LatencyChart
          title="Latency Across Queries"
          description="Live per-query measurements appear here after a benchmark run."
          data={EMPTY_MEASUREMENTS}
          variant="queries"
        />

        <LatencyChart
          title="Latency by Pipeline Stage"
          description="Live stage measurements appear here after a benchmark run."
          data={EMPTY_MEASUREMENTS}
          variant="stages"
        />
      </div>

      <div className="grid animate-rise gap-6 lg:grid-cols-2 [animation-delay:300ms]">
        <LatencyDistribution />
        <BenchmarkControls />
      </div>
    </div>
  )
}