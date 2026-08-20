import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Database,
  FlaskConical,
  LayoutDashboard,
  Mic,
  Settings,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import type { RouteId } from '../types'

export interface NavItem {
  id: RouteId
  label: string
  icon: LucideIcon
  description: string
  apiEndpoints: string[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Command center for the VaaniRAG AI system.',
    apiEndpoints: ['GET /api/health', 'GET /api/metrics'],
  },
  {
    id: 'voice-playground',
    label: 'Voice Playground',
    icon: Mic,
    description: 'Record, transcribe and listen back to spoken queries.',
    apiEndpoints: ['POST /api/stt', 'POST /api/query'],
  },
  {
    id: 'rag-pipeline',
    label: 'RAG Pipeline',
    icon: Workflow,
    description: 'End-to-end retrieval-augmented generation pipeline.',
    apiEndpoints: ['POST /api/query', 'GET /api/metrics'],
  },
  {
    id: 'retrieval-lab',
    label: 'Retrieval Lab',
    icon: FlaskConical,
    description: 'Experiment with retrieval strategies and inspect chunks.',
    apiEndpoints: ['GET /api/metrics'],
  },
  {
    id: 'latency-observatory',
    label: 'Latency Observatory',
    icon: Activity,
    description: 'Real-time latency and throughput telemetry.',
    apiEndpoints: ['GET /api/metrics'],
  },
  {
    id: 'trust-safety',
    label: 'Trust & Safety',
    icon: ShieldCheck,
    description: 'Guardrails, safety filters and audit controls.',
    apiEndpoints: ['GET /api/health'],
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    icon: Database,
    description: 'Manage source documents, chunks and embeddings.',
    apiEndpoints: ['GET /api/health'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Configure the VaaniRAG AI system.',
    apiEndpoints: ['GET /api/health'],
  },
]

export const getNavItem = (id: RouteId): NavItem =>
  NAV_ITEMS.find((item) => item.id === id) ?? NAV_ITEMS[0]