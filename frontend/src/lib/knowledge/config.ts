import {
  Boxes,
  Braces,
  BrainCog,
  Container,
  Database,
  Eraser,
  FileText,
  Layers,
  Languages,
  Network,
  Scissors,
  Tag,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface IndexingStageConfig {
  id: string
  name: string
  icon: LucideIcon
  description: string
}

export const INDEXING_PIPELINE: IndexingStageConfig[] = [
  {
    id: 'dataset',
    name: 'Dataset',
    icon: Database,
    description: 'MSMARCO-XI source corpus',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: Eraser,
    description: 'Normalize and filter the corpus',
  },
  {
    id: 'language-detection',
    name: 'Language Detection',
    icon: Languages,
    description: 'Detect the language of every document',
  },
  {
    id: 'chunking',
    name: 'Chunking',
    icon: Scissors,
    description: 'Split documents into indexable chunks',
  },
  {
    id: 'embedding',
    name: 'Embedding',
    icon: BrainCog,
    description: 'Generate vector embeddings per chunk',
  },
  {
    id: 'vector-index',
    name: 'Vector Index',
    icon: Network,
    description: 'Store chunks in the vector database',
  },
]

export interface EmbeddingFieldConfig {
  label: string
  icon: LucideIcon
}

export const EMBEDDING_FIELDS: EmbeddingFieldConfig[] = [
  { label: 'Embedding Model', icon: BrainCog },
  { label: 'Vector Database', icon: Container },
  { label: 'Dimension', icon: Layers },
  { label: 'Distance Metric', icon: Boxes },
  { label: 'Index Type', icon: Network },
]

export interface ChunkingStrategyConfig {
  name: string
  icon: LucideIcon
  description: string
}

export const CHUNKING_STRATEGIES: ChunkingStrategyConfig[] = [
  {
    name: 'Semantic Chunking',
    icon: Braces,
    description: 'Group sentences by meaning boundaries.',
  },
  {
    name: 'Sentence Chunking',
    icon: FileText,
    description: 'One sentence per chunk.',
  },
  {
    name: 'Sliding Window',
    icon: Layers,
    description: 'Overlapping windows for continuity.',
  },
  {
    name: 'Metadata-Aware Chunking',
    icon: Tag,
    description: 'Preserve context from surrounding metadata.',
  },
  {
    name: 'Adaptive Routing',
    icon: Workflow,
    description: 'Pick the strategy per document characteristics.',
  },
]

export const DOCUMENT_EXPLORER_COLUMNS = [
  'Document ID',
  'Language',
  'Query',
  'Passage',
  'Chunk Count',
  'Status',
]

export const PLACEHOLDER_LANGUAGE_PILLS = 8