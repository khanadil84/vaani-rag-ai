import type { LucideIcon } from 'lucide-react'

/**
 * Retrieval Lab data model — API-ready for the future indexing/retrieval
 * backend. No values are fabricated here; anything not connected is `null`
 * and rendered as "--" by the UI.
 */

export type RetrievalStrategyId =
  | 'semantic'
  | 'sentence'
  | 'sliding-window'
  | 'metadata-aware'
  | 'adaptive-routing'

export type RetrievalStrategyStatus = 'planned' | 'active'

export interface RetrievalStrategyConfig {
  id: RetrievalStrategyId
  name: string
  icon: LucideIcon
  explanation: string
  bestUse: string
  chunkSize: number | null
  overlap: number | null
  documents: number | null
  status: RetrievalStrategyStatus
}

export interface RetrievalFilterValues {
  strategy: RetrievalStrategyId | 'all' | ''
  language: string
  topK: number | null
  similarityThreshold: number | null
}

export interface IndexedChunk {
  documentId: string
  language: string
  chunkId: string
  strategy: RetrievalStrategyId
  chunkSize: number
  overlap: number
  similarityScore: number | null
  rerankScore: number | null
}

export interface RoutingExample {
  queryType: string
  exampleQuery: string
  strategy: RetrievalStrategyId
}

export interface RetrievalFlowStage {
  id: string
  label: string
  icon: LucideIcon
  detail: string
}

/**
 * Offline benchmark results for the validated retrieval candidate.
 * Kept separate from live runtime metrics — these are static measurements
 * from a controlled evaluation, not production traffic.
 */
export interface RetrievalBenchmarkMetrics {
  evaluatedQueries: number
  recallAt1: number
  recallAt3: number
  recallAt5: number
  recallAt10: number
  mrr: number
  p50Ms: number
  p70Ms: number
  p100Ms: number
  averageMs: number
  latencyTargetMs: number
  benchmarkLabel: string
  scopeNote: string
}