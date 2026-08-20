import {
  ArrowDownWideNarrow,
  AudioLines,
  BadgeCheck,
  Binary,
  Mic,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { LatencyStageId } from './types'

export interface LatencyStageConfig {
  id: LatencyStageId
  name: string
  short: string
  icon: LucideIcon
  tagline: string
}

export const LATENCY_TARGET_MS = 200

export const BENCHMARK_QUERY_OPTIONS = [10, 25, 50, 100]

export const LATENCY_STAGES: LatencyStageConfig[] = [
  {
    id: 'voice-input',
    name: 'Voice Input',
    short: 'Voice',
    icon: Mic,
    tagline: 'Audio capture',
  },
  {
    id: 'speech-to-text',
    name: 'Speech-to-Text',
    short: 'STT',
    icon: AudioLines,
    tagline: 'Sarvam STT',
  },
  {
    id: 'query-processing',
    name: 'Query Processing',
    short: 'Query',
    icon: SlidersHorizontal,
    tagline: 'Normalize & route',
  },
  {
    id: 'embedding',
    name: 'Embedding',
    short: 'Embed',
    icon: Binary,
    tagline: 'Vector encoding',
  },
  {
    id: 'vector-retrieval',
    name: 'Vector Retrieval',
    short: 'Retrieve',
    icon: ScanSearch,
    tagline: 'Similarity search',
  },
  {
    id: 'reranking',
    name: 'Reranking',
    short: 'Rerank',
    icon: ArrowDownWideNarrow,
    tagline: 'Score & re-order',
  },
  {
    id: 'llm-generation',
    name: 'LLM Generation',
    short: 'LLM',
    icon: Sparkles,
    tagline: 'Grounded answer',
  },
  {
    id: 'guardrails',
    name: 'Guardrails',
    short: 'Guard',
    icon: ShieldCheck,
    tagline: 'Safety checks',
  },
  {
    id: 'final-answer',
    name: 'Final Answer',
    short: 'Answer',
    icon: BadgeCheck,
    tagline: 'Deliver response',
  },
]