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

export const RETRIEVAL_STRATEGIES: RetrievalStrategyConfig[] = [
  {
    id: 'semantic',
    name: 'Semantic Chunking',
    icon: Layers,
    explanation: 'Splits content at meaning boundaries so related ideas stay intact.',
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
    explanation: 'Groups consecutive sentences into fixed-size chunks.',
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
    explanation: 'Uses overlapping windows to preserve context across chunk edges.',
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
    explanation: 'Respects document structure, headings and metadata when splitting.',
    bestUse: 'Metadata-dependent queries',
    chunkSize: null,
    overlap: null,
    documents: null,
    status: 'planned',
  },
  {
    id: 'adaptive-routing',
    name: 'Adaptive Routing',
    icon: Route,
    explanation: 'Selects the best strategy per query through the adaptive router.',
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
    exampleQuery: 'Explain how the monsoon affects agriculture in central India.',
    strategy: 'semantic',
  },
  {
    queryType: 'Long contextual query',
    exampleQuery: 'Trace the evolution of the Khajuraho temples across three centuries.',
    strategy: 'sliding-window',
  },
  {
    queryType: 'Metadata-dependent query',
    exampleQuery: 'Find 2023 policy documents on renewable energy funding.',
    strategy: 'metadata-aware',
  },
  {
    queryType: 'Unknown or complex query',
    exampleQuery: 'Analyze the impact of digital payments on rural markets.',
    strategy: 'adaptive-routing',
  },
]

export const RETRIEVAL_FLOW: RetrievalFlowStage[] = [
  { id: 'query', label: 'Query', icon: Mic, detail: 'Voice or text input' },
  { id: 'embedding', label: 'Query Embedding', icon: Binary, detail: 'Encode to vector' },
  { id: 'candidates', label: 'Dense + BM25 Retrieval', icon: ScanSearch, detail: 'Dense FAISS Top-50 + BM25 Top-20' },
  { id: 'fusion', label: 'RRF Fusion', icon: GitMerge, detail: 'Reciprocal rank fusion' },
  { id: 'context', label: 'Final Evidence', icon: ListChecks, detail: 'Final evidence set' },
  { id: 'grounding', label: 'Grounding', icon: Anchor, detail: 'Answer grounded in evidence' },
]

export const CHUNK_COLUMNS: Array<{ label: string; key: string }> = [
  { label: 'Document ID', key: 'documentId' },
  { label: 'Language', key: 'language' },
  { label: 'Chunk ID', key: 'chunkId' },
  { label: 'Chunking Strategy', key: 'strategy' },
  { label: 'Chunk Size', key: 'chunkSize' },
  { label: 'Overlap', key: 'overlap' },
  { label: 'Similarity Score', key: 'similarityScore' },
  { label: 'Rerank Score', key: 'rerankScore' },
]

export const RETRIEVAL_LANGUAGES = ['English', 'हिन्दी', 'Hinglish']

export const RETRIEVAL_TOPK_OPTIONS = [5, 10, 15, 20]

export const RETRIEVAL_THRESHOLD_OPTIONS = [0.5, 0.6, 0.7, 0.8, 0.9]

export function getStrategyName(id: RetrievalStrategyId): string {
  return (
    RETRIEVAL_STRATEGIES.find((strategy) => strategy.id === id)?.name ??
    'Adaptive Routing'
  )
}

export const ROUTER_STEPS: Array<{ label: string; icon: LucideIcon; detail: string }> = [
  { label: 'USER QUERY', icon: Mic, detail: 'Incoming question' },
  { label: 'QUERY ANALYSIS', icon: Braces, detail: 'Parse & normalize' },
  { label: 'COMPLEXITY DETECTION', icon: Gauge, detail: 'Assess the query' },
  { label: 'STRATEGY SELECTION', icon: GitBranch, detail: 'Pick a path' },
  { label: 'RETRIEVAL', icon: ScanSearch, detail: 'Execute search' },
]