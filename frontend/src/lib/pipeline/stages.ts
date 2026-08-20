import {
  ArrowDownWideNarrow,
  AudioLines,
  BadgeCheck,
  Braces,
  CircleCheck,
  FileSearch,
  Link,
  Mic,
  ScanSearch,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  Waypoints,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PipelineStageId } from './types'

export interface PipelineConfigItem {
  key: string
  value: string
}

export interface PipelineStageConfig {
  id: PipelineStageId
  name: string
  icon: LucideIcon
  tagline: string
  purpose: string
  input: string
  output: string
  configuration: PipelineConfigItem[]
  special?: 'chunking' | 'retrieval' | 'guardrails'
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: 'voice-input',
    name: 'Voice Input',
    icon: Mic,
    tagline: 'Captures the spoken query',
    purpose: 'Acquires audio from the browser microphone and prepares it for speech-to-text.',
    input: 'Microphone capture (browser)',
    output: 'Raw audio stream',
    configuration: [
      { key: 'Input device', value: '--' },
      { key: 'Audio format', value: '--' },
      { key: 'Sample rate', value: '--' },
    ],
  },
  {
    id: 'sarvam-stt',
    name: 'Sarvam STT',
    icon: AudioLines,
    tagline: 'Converts speech into text',
    purpose: 'Transcribes audio into text with the Sarvam speech-to-text engine and Indian language support.',
    input: 'Raw audio stream',
    output: 'Transcribed text',
    configuration: [
      { key: 'Model', value: '--' },
      { key: 'Language', value: '--' },
      { key: 'Streaming', value: '--' },
    ],
  },
  {
    id: 'query-processing',
    name: 'Query Processing',
    icon: SlidersHorizontal,
    tagline: 'Normalizes and routes the query',
    purpose: 'Cleans the transcript, detects language and prepares a canonical query for retrieval.',
    input: 'Transcribed text',
    output: 'Normalized query',
    configuration: [
      { key: 'Normalizer', value: '--' },
      { key: 'Language detection', value: '--' },
    ],
  },
  {
    id: 'adaptive-chunking',
    name: 'Adaptive Chunking',
    icon: Scissors,
    tagline: 'Splits documents into searchable chunks',
    purpose: 'Splits source documents into chunks using a strategy tuned to content type.',
    input: 'Source documents',
    output: 'Semantic chunks',
    configuration: [
      { key: 'Strategy', value: '--' },
      { key: 'Chunk size', value: '--' },
      { key: 'Overlap', value: '--' },
    ],
    special: 'chunking',
  },
  {
    id: 'embedding',
    name: 'Embedding',
    icon: Braces,
    tagline: 'Maps text into vector space',
    purpose: 'Encodes chunks and the query into dense embeddings for similarity search.',
    input: 'Chunks + query',
    output: 'Dense embeddings',
    configuration: [
      { key: 'Model', value: '--' },
      { key: 'Dimensions', value: '--' },
    ],
  },
  {
    id: 'vector-retrieval',
    name: 'Vector Retrieval',
    icon: ScanSearch,
    tagline: 'Searches the knowledge base',
    purpose: 'Performs similarity search over stored embeddings to surface relevant context.',
    input: 'Query embedding',
    output: 'Candidate chunks',
    configuration: [
      { key: 'Vector database', value: '--' },
      { key: 'Top-K', value: '--' },
      { key: 'Similarity search', value: '--' },
      { key: 'Reranking', value: '--' },
    ],
    special: 'retrieval',
  },
  {
    id: 'reranking',
    name: 'Reranking',
    icon: ArrowDownWideNarrow,
    tagline: 'Re-orders candidates by relevance',
    purpose: 'Improves retrieval quality by scoring candidate chunks against the query.',
    input: 'Candidate chunks',
    output: 'Ranked chunks',
    configuration: [
      { key: 'Reranker', value: '--' },
      { key: 'Score threshold', value: '--' },
    ],
  },
  {
    id: 'grounded-llm',
    name: 'Grounded LLM',
    icon: Waypoints,
    tagline: 'Generates a grounded answer',
    purpose: 'Produces the final answer constrained to the retrieved evidence.',
    input: 'Ranked chunks + query',
    output: 'Draft answer',
    configuration: [
      { key: 'Model', value: '--' },
      { key: 'Temperature', value: '--' },
      { key: 'Context window', value: '--' },
    ],
  },
  {
    id: 'guardrails',
    name: 'Guardrails',
    icon: ShieldCheck,
    tagline: 'Applies safety and grounding checks',
    purpose: 'Validates that the draft answer is safe, grounded and within policy before delivery.',
    input: 'Draft answer + evidence',
    output: 'Validated answer',
    configuration: [
      { key: 'Policies', value: '--' },
      { key: 'Sensitivity', value: '--' },
    ],
    special: 'guardrails',
  },
  {
    id: 'final-answer',
    name: 'Final Answer',
    icon: BadgeCheck,
    tagline: 'Delivers the response to the user',
    purpose: 'Presents the validated answer with source references back to the user.',
    input: 'Validated answer',
    output: 'User-facing response',
    configuration: [
      { key: 'Source references', value: '--' },
      { key: 'Format', value: '--' },
    ],
  },
]

export const CHUNKING_STRATEGIES: Array<{ name: string; description: string }> = [
  {
    name: 'Semantic Chunking',
    description: 'Splits content at natural meaning boundaries to keep ideas intact.',
  },
  {
    name: 'Sentence Chunking',
    description: 'Groups consecutive sentences into fixed-size chunks.',
  },
  {
    name: 'Sliding Window',
    description: 'Uses overlapping windows to preserve context across chunk edges.',
  },
  {
    name: 'Metadata-Aware Chunking',
    description: 'Respects document structure, headings and metadata when splitting.',
  },
]

export const GUARDRAIL_CHECKS: Array<{
  name: string
  description: string
  icon: LucideIcon
}> = [
  {
    name: 'Off-topic detection',
    description: 'Detects queries that fall outside the knowledge domain.',
    icon: ScanSearch,
  },
  {
    name: 'Safety check',
    description: 'Blocks harmful, abusive or unsafe prompts and outputs.',
    icon: ShieldAlert,
  },
  {
    name: 'Retrieval confidence',
    description: 'Verifies that retrieved evidence is confident enough to use.',
    icon: Link,
  },
  {
    name: 'Grounding verification',
    description: 'Confirms the answer is supported by the retrieved chunks.',
    icon: CircleCheck,
  },
  {
    name: 'Hallucination check',
    description: 'Flags content that cannot be traced back to source evidence.',
    icon: TriangleAlert,
  },
  {
    name: 'Output validation',
    description: 'Validates the final response format, language and structure.',
    icon: FileSearch,
  },
]

export function getStageConfig(id: PipelineStageId): PipelineStageConfig {
  return PIPELINE_STAGES.find((stage) => stage.id === id) ?? PIPELINE_STAGES[0]
}