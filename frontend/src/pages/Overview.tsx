import {
  Activity,
  Database,
  FlaskConical,
  Mic,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'
import PipelinePreview from '../components/PipelinePreview'
import StatusBadge from '../components/StatusBadge'
import VoiceCommandCenter from '../components/VoiceCommandCenter'
import { useBackendStatus } from '../hooks/useBackendStatus'
import { LATENCY_TARGET_MS } from '../lib/latency/stages'
import { cn } from '../lib/utils'
import type { RouteId } from '../types'

interface OverviewProps {
  onNavigate: (id: RouteId) => void
}

const FEATURE_CARDS = [
  { id: 'voice-playground' as const, icon: Mic, label: 'Voice Playground', hint: 'Record and transcribe' },
  { id: 'rag-pipeline' as const, icon: Workflow, label: 'RAG Pipeline', hint: 'Query with grounding' },
  { id: 'retrieval-lab' as const, icon: FlaskConical, label: 'Retrieval Lab', hint: 'Inspect retrieval' },
  { id: 'latency-observatory' as const, icon: Activity, label: 'Latency Observatory', hint: 'Live telemetry' },
  { id: 'trust-safety' as const, icon: ShieldCheck, label: 'Trust & Safety', hint: 'Guardrails' },
  { id: 'knowledge-base' as const, icon: Database, label: 'Knowledge Base', hint: 'Manage sources' },
]

export default function Overview({ onNavigate }: OverviewProps) {
  const { status, metrics, loading, error } = useBackendStatus()

  const lastQuery = metrics?.lastQuery ?? null
  const queriesProcessed = metrics?.queriesProcessed ?? null
  const avgLatencyMs = metrics?.avgLatencyMs ?? null
  const guardrailNote =
    lastQuery?.guardrail_reason?.split('.')[0] ?? 'Passed structural guardrails'

  const ragCaption = error
    ? 'Backend unreachable · not measured'
    : loading
      ? 'Loading backend metrics...'
      : 'Total queries sent to POST /api/query'

  const retrievalCaption = error
    ? 'Backend unreachable · not measured'
    : loading
      ? 'Loading backend metrics...'
      : 'Evidence chunks from the latest query'

  const trustCaption = error
    ? 'Backend unreachable · not measured'
    : loading
      ? 'Loading backend metrics...'
      : lastQuery
        ? guardrailNote
        : 'No guardrail decisions yet'

  const latencyCaption = error
    ? 'Backend unreachable · not measured'
    : loading
      ? 'Loading backend metrics...'
      : avgLatencyMs != null
        ? `Average handle ${avgLatencyMs} ms · target ${LATENCY_TARGET_MS} ms`
        : 'Full pipeline latency target'

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={Mic}
        eyebrow="VaaniRAG AI · Command Center"
        title="Overview"
        description="Voice. Retrieval. Intelligence — Built for Bharat. Everything you need to operate VaaniRAG AI from one place."
      />

      <VoiceCommandCenter className="[animation-delay:60ms]" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="RAG Pipeline"
          icon={Workflow}
          value={queriesProcessed != null ? String(queriesProcessed) : '--'}
          caption={ragCaption}
          accent="violet"
          className="animate-rise"
        />
        <MetricCard
          title="Retrieval Strategy"
          icon={FlaskConical}
          value={lastQuery ? String(lastQuery.evidence_count) : '--'}
          caption={retrievalCaption}
          accent="cyan"
          className="animate-rise [animation-delay:80ms]"
        />
        <MetricCard
          title="Trust & Safety"
          icon={ShieldCheck}
          value={lastQuery ? (lastQuery.answer ? 'Answered' : 'No answer') : '--'}
          caption={trustCaption}
          accent="saffron"
          className="animate-rise [animation-delay:160ms]"
        />
        <MetricCard
          title="Latency Target"
          icon={Sparkles}
          value={`< ${LATENCY_TARGET_MS} ms`}
          caption={latencyCaption}
          accent="cyan"
          className="animate-rise [animation-delay:240ms]"
        />
      </div>

      <PipelinePreview
        className="animate-rise [animation-delay:120ms]"
        onNavigate={onNavigate}
      />

      <section className="animate-rise [animation-delay:200ms]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-white">
              Command Center
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-400">
              Jump straight into any module of the platform.
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.id)}
                className="glass card-hover focus-ring group flex items-center gap-4 rounded-2xl p-4 text-left transition-transform active:scale-[0.98]"
              >
                <div
                  className={cn(
                    'rounded-xl p-2.5 ring-1 transition-colors',
                    'bg-cyan-accent/10 text-cyan-accent ring-cyan-accent/20 group-hover:bg-cyan-accent/15',
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{card.label}</p>
                  <p className="truncate text-xs text-slate-500">{card.hint}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}