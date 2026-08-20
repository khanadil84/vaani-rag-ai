import type { RetrievalBenchmarkMetrics } from './types'

/**
 * Static benchmark measurements for the validated production retrieval
 * candidate: Dense FAISS Top-50 + BM25 Top-20 fused with RRF.
 *
 * These are offline evaluation results, not live traffic metrics. Keep this
 * constant isolated from any runtime/backend data sources.
 */
export const VALIDATED_RETRIEVAL_BENCHMARK = {
  evaluatedQueries: 104,
  recallAt1: 24.04,
  recallAt3: 49.04,
  recallAt5: 67.31,
  recallAt10: 76.92,
  mrr: 0.405,
  p50Ms: 52.4,
  p70Ms: 59.85,
  p100Ms: 92.33,
  averageMs: 53.06,
  latencyTargetMs: 200,
  benchmarkLabel: 'Validated benchmark measurements',
  scopeNote:
    '104 valid queries with at least one selected passage. 96 queries were excluded from recall evaluation because no selected passage was available.',
} satisfies RetrievalBenchmarkMetrics
