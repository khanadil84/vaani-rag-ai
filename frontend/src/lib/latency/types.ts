/**
 * Latency Observatory data model — API-ready for the future benchmark
 * backend. Unmeasured values are `null` and rendered as "--" by the UI;
 * nothing is fabricated.
 */

export type LatencyStageId =
  | 'voice-input'
  | 'speech-to-text'
  | 'query-processing'
  | 'embedding'
  | 'vector-retrieval'
  | 'reranking'
  | 'llm-generation'
  | 'guardrails'
  | 'final-answer'

export interface StageLatency {
  stage: LatencyStageId
  latencyMs: number
}

export interface LatencyMeasurement {
  queryId: string
  totalLatencyMs: number
  stages: StageLatency[]
  timestamp: string
}

export interface LatencySummary {
  p50: number | null
  p70: number | null
  p100: number | null
  average: number | null
  queryCount: number | null
}

export type BenchmarkRunState = 'idle' | 'not-connected'