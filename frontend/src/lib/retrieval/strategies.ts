import {
  Anchor,
  Binary,
  Braces,
  Gauge,
  GitBranch,
  GitMerge,
  Layers,
  ListChecks,
  Mic,
  Repeat,
  Route,
  ScanSearch,
  Tags,
  TextQuote,
} from 'lucide-react'
import type {
  RetrievalFlowStage,
  RetrievalStrategyConfig,
  RetrievalStrategyId,
  RoutingExample,
} from './types'
import type { LucideIcon } from 'lucide-react'

/**
 * VaaniRAG Retrieval Architecture
 *
 * The Retrieval Lab exposes the multi-strategy architecture used to
 * organize retrieval. Only capabilities that are currently backed by
 * verified dataset/index evidence are marked active.
 *
 * Verified:
 * - MSMARCO-XI passage/query metadata
 * - 19,987 corpus rows
 * - FAISS: 20,295 vectors, 512 dimensions
 * - BM25 retrieval
 * - BM25 + FAISS RRF experiment
 *
 * Planned strategies remain visible as architecture extensions and are
 * not presented as fully implemented production capabilities.
 */

export const RETRIEVAL_STRATEGIES: RetrievalStrategyConfig[] = [
  {
    id: 'semantic',
    name: 'Semantic Chunking',
    icon: Layers,
    explanation:
      'Meaning-aware chunking architecture for preserving related context and semantic boundaries.',
    bestUse: 'Complex, contextual queries',
    chunkSize: null,
    overlap: null,
    documents: null,
    status: 'planned',
  },
  {
    id: 'sentence',
    name: 'Sentence Chunking',
    icon: TextQuote,
    explanation:
      'Sentence-level passage representation designed for concise factual retrieval.',
    bestUse: 'Simple factual queries',
    chunkSize: null,
    overlap: null,
    documents: null,
    status: 'planned',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    icon: Repeat,
    explanation:
      'Overlapping context-window architecture designed to preserve information across passage boundaries.',
    bestUse: 'Long contextual queries',
    chunkSize: null,
    overlap: null,
    documents: null,
    status: 'planned',
  },
  {
    id: 'metadata-aware',
    name: 'Metadata-Aware Chunking',
    icon: Tags,
    explanation:
      'Retrieval representation preserves MSMARCO-XI query, passage, language and selection metadata.',
    bestUse: 'Metadata-dependent queries',
    chunkSize: null,
    overlap: null,
    documents: 19987,
    status: 'active',
  },
  {
    id: 'adaptive-routing',
    name: 'Adaptive Routing',
    icon: Route,
    explanation:
      'Routing architecture for selecting an appropriate retrieval strategy based on query characteristics.',
    bestUse: 'Unknown or complex queries',
    chunkSize: null,
    overlap: null,
    documents: null,
    status: 'planned',
  },
]

export const ROUTING_EXAMPLES: RoutingExample[] = [
  {
    queryType: 'Simple factual query',
    exampleQuery: 'What is the capital of Rajasthan?',
    strategy: 'sentence',
  },
  {
    queryType: 'Complex contextual query',
    exampleQuery:
      'Explain how the monsoon affects agriculture in central India.',
    strategy: 'semantic',
  },
  {
    queryType: 'Long contextual query',
    exampleQuery:
      'Trace the evolution of the Khajuraho temples across three centuries.',
    strategy: 'sliding-window',
  },
  {
    queryType: 'Metadata-dependent query',
    exampleQuery:
      'Find 2023 policy documents on renewable energy funding.',
    strategy: 'metadata-aware',
  },
  {
    queryType: 'Unknown or complex query',
    exampleQuery:
      'Analyze the impact of digital payments on rural markets.',
    strategy: 'adaptive-routing',
  },
]

/**
 * Validated retrieval architecture:
 *
 * Voice/Text Query
 *       ↓
 * Query Embedding
 *       ↓
 * ┌───────────────┬───────────────┐
 * │ Dense / FAISS │     BM25      │
 * │    Top-50     │    Top-20     │
 * └───────────────┴───────────────┘
 *       ↓
 *    RRF Fusion
 *       ↓
 * Final Evidence
 *       ↓
 * Semantic Grounding
 */

export const RETRIEVAL_FLOW: RetrievalFlowStage[] = [
  {
    id: 'query',
    label: 'Query',
    icon: Mic,
    detail: 'Voice or text input',
  },
  {
    id: 'embedding',
    label: 'Query Embedding',
    icon: Binary,
    detail: 'Encode query into dense vector representation',
  },
  {
    id: 'candidates',
    label: 'Dense + BM25 Retrieval',
    icon: ScanSearch,
    detail: 'FAISS Top-50 + BM25 Top-20 candidate retrieval',
  },
  {
    id: 'fusion',
    label: 'RRF Fusion',
    icon: GitMerge,
    detail: 'Reciprocal Rank Fusion combines complementary rankings',
  },
  {
    id: 'context',
    label: 'Final Evidence',
    icon: ListChecks,
    detail: 'Select final evidence candidates',
  },
  {
    id: 'grounding',
    label: 'Grounding',
    icon: Anchor,
    detail: 'CrossEncoder semantic evidence verification',
  },
]

export const CHUNK_COLUMNS: Array<{
  label: string
  key: string
}> = [
  {
    label: 'Document ID',
    key: 'documentId',
  },
  {
    label: 'Language',
    key: 'language',
  },
  {
    label: 'Chunk ID',
    key: 'chunkId',
  },
  {
    label: 'Chunking Strategy',
    key: 'strategy',
  },
  {
    label: 'Chunk Size',
    key: 'chunkSize',
  },
  {
    label: 'Overlap',
    key: 'overlap',
  },
  {
    label: 'Similarity Score',
    key: 'similarityScore',
  },
  {
    label: 'Rerank Score',
    key: 'rerankScore',
  },
]

export const RETRIEVAL_LANGUAGES = [
  'English',
  'हिन्दी',
  'Hinglish',
]

export const RETRIEVAL_TOPK_OPTIONS = [
  5,
  10,
  15,
  20,
]

export const RETRIEVAL_THRESHOLD_OPTIONS = [
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
]

export function getStrategyName(
  id: RetrievalStrategyId,
): string {
  return (
    RETRIEVAL_STRATEGIES.find(
      (strategy) => strategy.id === id,
    )?.name ?? 'Adaptive Routing'
  )
}

export const ROUTER_STEPS: Array<{
  label: string
  icon: LucideIcon
  detail: string
}> = [
  {
    label: 'USER QUERY',
    icon: Mic,
    detail: 'Incoming voice or text question',
  },
  {
    label: 'QUERY ANALYSIS',
    icon: Braces,
    detail: 'Parse and normalize the query',
  },
  {
    label: 'COMPLEXITY DETECTION',
    icon: Gauge,
    detail: 'Assess query characteristics',
  },
  {
    label: 'STRATEGY SELECTION',
    icon: GitBranch,
    detail: 'Select the retrieval path',
  },
  {
    label: 'RETRIEVAL',
    icon: ScanSearch,
    detail: 'Execute dense and lexical retrieval',
  },
]