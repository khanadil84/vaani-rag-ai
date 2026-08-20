import { CornerDownRight, Plug, WifiOff } from 'lucide-react'
import {
  CHUNKING_STRATEGIES,
  GUARDRAIL_CHECKS,
} from '../lib/pipeline/stages'
import type { PipelineStageConfig } from '../lib/pipeline/stages'
import type { PipelineStageState } from '../lib/pipeline/types'
import PipelineStatusBadge from './PipelineStatusBadge'

interface StageDetailPanelProps {
  stage: PipelineStageConfig
  state: PipelineStageState
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
      <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-medium text-slate-300">{value}</p>
    </div>
  )
}

function ConfigRow({ item }: { item: { key: string; value: string } }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg px-1 py-1.5">
      <span className="text-[12px] text-slate-400">{item.key}</span>
      <code className="font-mono text-[12px] text-slate-500">{item.value}</code>
    </div>
  )
}

export default function StageDetailPanel({ stage, state }: StageDetailPanelProps) {
  const Icon = stage.icon
  return (
    <div className="glass-strong rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl bg-gradient-to-br from-cyan-accent/20 to-violet-accent/20 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/20"
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight text-white">
              {stage.name}
            </h3>
            <p className="text-[11px] text-slate-500">Stage detail</p>
          </div>
        </div>
        <PipelineStatusBadge
          status={state.status}
          latencyMs={state.latencyMs}
        />
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
            Stage purpose
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-300">
            {stage.purpose}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailRow label="Input" value={stage.input} />
          <DetailRow label="Output" value={stage.output} />
        </div>

        <div className="rounded-xl border border-white/10 bg-night-950/50 px-3.5 py-3">
          <div className="flex items-center gap-2">
            <Plug className="size-3.5 text-violet-soft" aria-hidden="true" />
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Configuration
            </p>
          </div>
          <div className="mt-1 divide-y divide-white/5">
            {stage.configuration.map((item) => (
              <ConfigRow key={item.key} item={item} />
            ))}
          </div>
        </div>

        {stage.special === 'chunking' && (
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Chunking strategies
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {CHUNKING_STRATEGIES.map((strategy) => (
                <div
                  key={strategy.name}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-slate-200">
                      {strategy.name}
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-semibold tracking-widest text-slate-500 uppercase">
                      Planned
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">
                    {strategy.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              No strategy is active until the chunking service is connected.
            </p>
          </div>
        )}

        {stage.special === 'retrieval' && (
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
            <div
              className="rounded-lg bg-violet-accent/10 p-2 text-violet-soft"
              aria-hidden="true"
            >
              <WifiOff className="size-4" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-200">
                Vector database not connected
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                Database, Top-K, similarity search and reranking remain '--'
                until the retrieval service is wired.
              </p>
            </div>
          </div>
        )}

        {stage.special === 'guardrails' && (
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Guardrail checks
            </p>
            <ul className="mt-2 space-y-2">
              {GUARDRAIL_CHECKS.map((check) => {
                const CheckIcon = check.icon
                return (
                  <li
                    key={check.name}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5"
                  >
                    <div
                      className="rounded-lg bg-slate-500/10 p-1.5 text-slate-400"
                      aria-hidden="true"
                    >
                      <CheckIcon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-slate-200">
                        {check.name}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                        {check.description}
                      </p>
                    </div>
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-600"
                      aria-hidden="true"
                    />
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 text-[11px] text-slate-500">
              Checks are defined but inactive until the guardrail service runs.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[11px] text-slate-500">
          <CornerDownRight className="size-3.5 shrink-0 text-cyan-accent/60" aria-hidden="true" />
          <span className="leading-snug">
            Streamed by the backend via typed pipeline events. No values are
            simulated.
          </span>
        </div>
      </div>
    </div>
  )
}