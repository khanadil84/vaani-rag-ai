import {
  AudioLines,
  Database,
  FileSearch,
  Gauge,
  Languages,
  Mic,
  Radio,
  ScanSearch,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Timer,
  WandSparkles,
  Waypoints,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RouteId } from '../types'

export interface ModuleFeature {
  icon: LucideIcon
  title: string
  description: string
}

export interface ModuleConfig {
  eyebrow: string
  accent: 'cyan' | 'violet' | 'saffron'
  features: ModuleFeature[]
}

export const MODULE_CONFIG: Record<RouteId, ModuleConfig> = {
  overview: {
    eyebrow: 'Overview',
    accent: 'cyan',
    features: [],
  },
  'voice-playground': {
    eyebrow: 'Voice Playground',
    accent: 'cyan',
    features: [
      {
        icon: Mic,
        title: 'Record your voice',
        description: 'Capture a query by speaking in your preferred language.',
      },
      {
        icon: Languages,
        title: 'Regional languages',
        description: 'Designed for Indian languages — Hindi, Tamil, Bengali, Telugu and more.',
      },
      {
        icon: AudioLines,
        title: 'Transcript viewer',
        description: 'Review the transcribed text before it is sent downstream.',
      },
    ],
  },
  'rag-pipeline': {
    eyebrow: 'RAG Pipeline',
    accent: 'violet',
    features: [
      {
        icon: Workflow,
        title: 'Query orchestration',
        description: 'Route a voice query through retrieval and generation stages.',
      },
      {
        icon: Waypoints,
        title: 'Grounded answers',
        description: 'Answers are grounded in the connected knowledge base, never fabricated.',
      },
      {
        icon: WandSparkles,
        title: 'Source attribution',
        description: 'Each answer can carry references back to the source chunks.',
      },
    ],
  },
  'retrieval-lab': {
    eyebrow: 'Retrieval Lab',
    accent: 'cyan',
    features: [
      {
        icon: ScanSearch,
        title: 'Vector search',
        description: 'Find the most relevant chunks for a given query.',
      },
      {
        icon: FileSearch,
        title: 'Chunk inspector',
        description: 'Open individual chunks and see exactly what was retrieved.',
      },
      {
        icon: Database,
        title: 'Source mapping',
        description: 'Understand which documents a chunk originated from.',
      },
    ],
  },
  'latency-observatory': {
    eyebrow: 'Latency Observatory',
    accent: 'saffron',
    features: [
      {
        icon: Timer,
        title: 'End-to-end timing',
        description: 'Track time from voice input to final generated answer.',
      },
      {
        icon: Gauge,
        title: 'Stage-level breakdown',
        description: 'Inspect timing per stage: transcribe, retrieve, generate.',
      },
      {
        icon: Radio,
        title: 'Live telemetry',
        description: 'Stream real operational metrics as they arrive from the backend.',
      },
    ],
  },
  'trust-safety': {
    eyebrow: 'Trust & Safety',
    accent: 'saffron',
    features: [
      {
        icon: ShieldCheck,
        title: 'Guardrails',
        description: 'Apply safety filters before and after generation.',
      },
      {
        icon: ShieldAlert,
        title: 'Harmful content',
        description: 'Detect and block harmful prompts or unsafe outputs.',
      },
      {
        icon: ScrollText,
        title: 'Audit trail',
        description: 'Keep an auditable log of queries and moderation decisions.',
      },
    ],
  },
  'knowledge-base': {
    eyebrow: 'Knowledge Base',
    accent: 'violet',
    features: [
      {
        icon: Database,
        title: 'Source documents',
        description: 'Manage the documents that power retrieval.',
      },
      {
        icon: FileSearch,
        title: 'Chunking pipeline',
        description: 'Documents are split into searchable chunks before indexing.',
      },
      {
        icon: Workflow,
        title: 'Re-indexing',
        description: 'Refresh embeddings when sources change.',
      },
    ],
  },
  settings: {
    eyebrow: 'Settings',
    accent: 'cyan',
    features: [
      {
        icon: Mic,
        title: 'Voice preferences',
        description: 'Default language, audio input and transcription settings.',
      },
      {
        icon: ShieldCheck,
        title: 'Safety configuration',
        description: 'Tune moderation strictness and trust controls.',
      },
      {
        icon: Gauge,
        title: 'Retrieval tuning',
        description: 'Configure retrieval depth and generation behavior.',
      },
    ],
  },
}