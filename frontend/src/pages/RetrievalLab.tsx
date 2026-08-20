import {
  BadgeCheck,
  BarChart3,
  Crosshair,
  FlaskConical,
  Gauge,
  GitMerge,
  Lightbulb,
  ListChecks,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import AdaptiveRouter from '../components/AdaptiveRouter'
import ChunkExplorer from '../components/ChunkExplorer'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'
import RetrievalFlow from '../components/RetrievalFlow'
import RetrievalStrategyCard from '../components/RetrievalStrategyCard'
import { VALIDATED_RETRIEVAL_BENCHMARK } from '../lib/retrieval/benchmark'
import { RETRIEVAL_STRATEGIES } from '../lib/retrieval/strategies'
import type { RetrievalFilterValues } from '../lib/retrieval/types'
import { cn } from '../lib/utils'

const DEFAULT_FILTERS: RetrievalFilterValues = {
  strategy: '',
  language: '',
  topK: null,
  similarityThreshold: null,
}

function BenchmarkStat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2',
        highlight
          ? 'border-emerald-400/30 bg-emerald-400/10'
          : 'border-white/10 bg-night-950/50',
      )}
    >
      <p className="text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          'mt-0.5 font-mono text-[13px]',
          highlight ? 'text-emerald-300' : 'text-slate-300',
        )}
      >
        {value}
      </p>
    </div>
  )
}

export default function RetrievalLab() {
  const [filters, setFilters] = useState<RetrievalFilterValues>(DEFAULT_FILTERS)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={FlaskConical}
        eyebrow="Retrieval Lab"
        title="Retrieval Lab"
        description="Prepare the multi-strategy retrieval architecture behind VaaniRAG AI — chunking, routing and inspection."
      />

      <section className="animate-rise [animation-delay:60ms]">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Adaptive Retrieval Engine
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Multiple chunking strategies designed for different query types.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RETRIEVAL_STRATEGIES.map((strategy) => (
            <RetrievalStrategyCard
              key={strategy.id}
              strategy={strategy}
              className="animate-rise"
            />
          ))}
        </div>
      </section>

      <AdaptiveRouter className="animate-rise [animation-delay:120ms]" />

      <ChunkExplorer
        value={filters}
        onChange={setFilters}
        className="animate-rise [animation-delay:180ms]"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <RetrievalFlow className="animate-rise [animation-delay:240ms]" />

        <section className="glass card-hover animate-rise rounded-2xl p-5 sm:p-6 [animation-delay:240ms]">
          <div className="flex items-center gap-3">
            <div
              className="rounded-xl bg-saffron-accent/10 p-2.5 text-saffron-accent ring-1 ring-saffron-accent/20"
              aria-hidden="true"
            >
              <Lightbulb className="size-5" />
            </div>
            <h2 className="font-display text-base font-semibold tracking-tight text-white">
              Why multiple strategies?
            </h2>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-slate-300">
            Different questions require different context boundaries. VaaniRAG
            AI will evaluate multiple chunking strategies and select the most
            appropriate retrieval path.
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Strategy selection is evaluated per query and streamed by the
            retrieval backend when connected.
          </p>
        </section>
      </div>

      <section className="glass card-hover animate-rise rounded-2xl p-5 sm:p-6 [animation-delay:300ms]">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300 ring-1 ring-emerald-400/20"
            aria-hidden="true"
          >
            <BadgeCheck className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-white">
              Validated Benchmark Measurements
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-400">
              Offline evaluation of the validated retrieval candidate — not
              live traffic metrics.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Queries Evaluated"
            icon={ListChecks}
            value={String(VALIDATED_RETRIEVAL_BENCHMARK.evaluatedQueries)}
            caption="Valid queries with at least one selected passage"
            accent="cyan"
          />
          <MetricCard
            title="Recall@1"
            icon={Target}
            value={String(VALIDATED_RETRIEVAL_BENCHMARK.recallAt1)}
            unit="%"
            caption="Evidence recall at rank 1"
            accent="violet"
          />
          <MetricCard
            title="Recall@3"
            icon={Crosshair}
            value={String(VALIDATED_RETRIEVAL_BENCHMARK.recallAt3)}
            unit="%"
            caption="Evidence recall at rank 3"
            accent="cyan"
          />
          <MetricCard
            title="Recall@5"
            icon={TrendingUp}
            value={String(VALIDATED_RETRIEVAL_BENCHMARK.recallAt5)}
            unit="%"
            caption="Evidence recall at rank 5"
            accent="violet"
          />
          <MetricCard
            title="Recall@10"
            icon={BarChart3}
            value={String(VALIDATED_RETRIEVAL_BENCHMARK.recallAt10)}
            unit="%"
            caption="Evidence recall at rank 10"
            accent="cyan"
          />
          <MetricCard
            title="MRR"
            icon={Gauge}
            value={VALIDATED_RETRIEVAL_BENCHMARK.mrr.toFixed(4)}
            caption="Mean reciprocal rank"
            accent="saffron"
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-night-950/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Timer className="size-4 text-cyan-accent" aria-hidden="true" />
                <h3 className="text-[13px] font-semibold text-white">
                  Latency Profile
                </h3>
              </div>
              <span className="rounded-full border border-saffron-accent/30 bg-saffron-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-saffron-accent uppercase">
                Target {'<'}
                {VALIDATED_RETRIEVAL_BENCHMARK.latencyTargetMs} ms
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
              <BenchmarkStat
                label="P50"
                value={`${VALIDATED_RETRIEVAL_BENCHMARK.p50Ms.toFixed(2)} ms`}
              />
              <BenchmarkStat
                label="P70"
                value={`${VALIDATED_RETRIEVAL_BENCHMARK.p70Ms.toFixed(2)} ms`}
              />
              <BenchmarkStat
                label="P100"
                value={`${VALIDATED_RETRIEVAL_BENCHMARK.p100Ms.toFixed(2)} ms`}
                highlight
              />
              <BenchmarkStat
                label="Average"
                value={`${VALIDATED_RETRIEVAL_BENCHMARK.averageMs.toFixed(2)} ms`}
              />
              <BenchmarkStat
                label="Target"
                value={`<${VALIDATED_RETRIEVAL_BENCHMARK.latencyTargetMs} ms`}
              />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
              P100 at {VALIDATED_RETRIEVAL_BENCHMARK.p100Ms.toFixed(2)} ms stays
              below the {VALIDATED_RETRIEVAL_BENCHMARK.latencyTargetMs} ms
              latency target.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-night-950/50 p-4">
              <h3 className="text-[13px] font-semibold text-white">Scope</h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                {VALIDATED_RETRIEVAL_BENCHMARK.scopeNote}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-accent/15 bg-cyan-accent/5 p-4">
              <div className="flex items-center gap-2">
                <GitMerge className="size-4 text-cyan-accent" aria-hidden="true" />
                <h3 className="text-[13px] font-semibold text-white">
                  Validated Retrieval Method
                </h3>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                Dense FAISS Top-50 + BM25 Top-20 fused with RRF. This is the
                retrieval method, not a chunking strategy — the five chunking
                strategies above are separate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}