import { ChevronRight, MousePointerClick, RadioTower } from 'lucide-react'
import { Fragment, useState } from 'react'
import { PIPELINE_STAGES } from '../lib/pipeline/stages'
import {
  createIdlePipelineState,
  hasPipelineActivity,
} from '../lib/pipeline/types'
import type { PipelineState, PipelineStageId } from '../lib/pipeline/types'
import { cn } from '../lib/utils'
import PipelineStatusBadge from './PipelineStatusBadge'
import StageDetailPanel from './StageDetailPanel'

interface RagPipelineVisualizerProps {
  className?: string
  pipelineState?: PipelineState
}

export default function RagPipelineVisualizer({
  className,
  pipelineState = createIdlePipelineState(),
}: RagPipelineVisualizerProps) {
  const [selectedId, setSelectedId] = useState<PipelineStageId | null>(null)

  const connected = hasPipelineActivity(pipelineState)
  const selectedStage = selectedId
    ? PIPELINE_STAGES.find((stage) => stage.id === selectedId) ?? null
    : null

  return (
    <section className={cn('grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]', className)}>
      <div className="min-w-0">
        <div
          className={cn(
            'flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors',
            connected
              ? 'border-emerald-400/25 bg-emerald-400/10'
              : 'border-cyan-accent/20 bg-cyan-accent/[0.06]',
          )}
        >
          <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
            {connected ? (
              <span className="inline-flex size-2.5 rounded-full bg-emerald-400" />
            ) : (
              <>
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-accent opacity-60 animate-ping" />
                <span className="relative inline-flex size-2.5 rounded-full bg-cyan-accent" />
              </>
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              {connected ? 'Query in flight' : 'Waiting for query'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {connected
                ? 'Streaming pipeline events from the backend.'
                : 'The pipeline activates when the backend streams its first event.'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          {PIPELINE_STAGES.map((stage, index) => {
            const Icon = stage.icon
            const stageState = pipelineState[stage.id]
            const isSelected = selectedId === stage.id
            const stepLabel = String(index + 1).padStart(2, '0')
            return (
              <Fragment key={stage.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(stage.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'group w-full rounded-2xl border p-4 text-left backdrop-blur-xl transition-all duration-300',
                    isSelected
                      ? 'border-cyan-accent/40 bg-white/[0.06] shadow-[0_0_35px_rgba(34,211,238,0.15)]'
                      : 'border-white/10 bg-white/[0.04] hover:border-cyan-accent/30 hover:bg-white/[0.06] hover:shadow-[0_0_25px_rgba(34,211,238,0.08)]',
                  )}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative shrink-0">
                      <span
                        className={cn(
                          'absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-accent/25 to-violet-accent/25 opacity-0 blur transition-opacity duration-300',
                          isSelected && 'opacity-100',
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          'relative flex size-11 items-center justify-center rounded-xl ring-1 transition-colors',
                          isSelected
                            ? 'bg-night-800 text-cyan-accent ring-cyan-accent/30'
                            : 'bg-night-800 text-cyan-accent/80 ring-white/10 group-hover:text-cyan-accent',
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="size-5" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500">
                          {stepLabel}
                        </span>
                        <h3 className="truncate text-sm font-semibold text-white">
                          {stage.name}
                        </h3>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {stage.tagline}
                      </p>
                    </div>

                    <PipelineStatusBadge
                      status={stageState.status}
                      latencyMs={stageState.latencyMs}
                      className="hidden shrink-0 sm:inline-flex"
                    />

                    <ChevronRight
                      className={cn(
                        'size-4 shrink-0 text-slate-500 transition-transform duration-300',
                        isSelected && 'rotate-90 text-cyan-accent',
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  <PipelineStatusBadge
                    status={stageState.status}
                    latencyMs={stageState.latencyMs}
                    className="mt-3 inline-flex sm:hidden"
                  />
                </button>

                {index < PIPELINE_STAGES.length - 1 && (
                  <div
                    className="relative mx-auto h-8 w-px bg-gradient-to-b from-white/15 via-white/5 to-white/15"
                    aria-hidden="true"
                  >
                    <span
                      className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-cyan-accent/70 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-flow-y"
                      style={{ animationDelay: `${index * 0.4}s` }}
                    />
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        {selectedStage ? (
          <StageDetailPanel
            stage={selectedStage}
            state={pipelineState[selectedStage.id]}
          />
        ) : (
          <div className="glass flex flex-col items-center rounded-2xl p-8 text-center">
            <div
              className="flex size-12 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10"
              aria-hidden="true"
            >
              <MousePointerClick className="size-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">Select a stage</p>
            <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-slate-500">
              Choose any pipeline stage to inspect its purpose, data contract and
              configuration.
            </p>
            <div
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-widest text-slate-400 uppercase"
              role="status"
            >
              <RadioTower className="size-3 text-cyan-accent" aria-hidden="true" />
              Live from backend
            </div>
          </div>
        )}
      </aside>
    </section>
  )
}