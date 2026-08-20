/**
 * RAG Pipeline event model — API-ready for the future backend stream.
 *
 * A real backend (e.g. a WebSocket or SSE connection) will emit
 * `PipelineStageEvent` objects as a query flows through the pipeline.
 * `reducePipelineEvent` applies them to the local `PipelineState` so the
 * visualizer can render status, latency and metadata without any hardcoding.
 */

export type PipelineStatus = 'idle' | 'processing' | 'completed' | 'error'

export type PipelineStageId =
  | 'voice-input'
  | 'sarvam-stt'
  | 'query-processing'
  | 'adaptive-chunking'
  | 'embedding'
  | 'vector-retrieval'
  | 'reranking'
  | 'grounded-llm'
  | 'guardrails'
  | 'final-answer'

export interface PipelineStageEvent {
  stage: PipelineStageId
  status: PipelineStatus
  latencyMs: number | null
  metadata: Record<string, unknown> | null
  error: string | null
  timestamp: string
}

export interface PipelineStageState {
  status: PipelineStatus
  latencyMs: number | null
  metadata: Record<string, unknown> | null
  error: string | null
}

export type PipelineState = Record<PipelineStageId, PipelineStageState>

export type PipelineEventHandler = (event: PipelineStageEvent) => void

const IDLE_STAGE: PipelineStageState = {
  status: 'idle',
  latencyMs: null,
  metadata: null,
  error: null,
}

export const STAGE_IDS: PipelineStageId[] = [
  'voice-input',
  'sarvam-stt',
  'query-processing',
  'adaptive-chunking',
  'embedding',
  'vector-retrieval',
  'reranking',
  'grounded-llm',
  'guardrails',
  'final-answer',
]

export function createIdlePipelineState(): PipelineState {
  return Object.fromEntries(
    STAGE_IDS.map((id) => [id, { ...IDLE_STAGE }]),
  ) as PipelineState
}

export function reducePipelineEvent(
  state: PipelineState,
  event: PipelineStageEvent,
): PipelineState {
  return {
    ...state,
    [event.stage]: {
      status: event.status,
      latencyMs: event.latencyMs,
      metadata: event.metadata,
      error: event.error,
    },
  }
}

export function hasPipelineActivity(state: PipelineState): boolean {
  return STAGE_IDS.some(
    (id) => state[id].status !== 'idle' || state[id].latencyMs !== null,
  )
}