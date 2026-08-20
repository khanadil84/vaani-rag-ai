import {
  Anchor,
  BadgeCheck,
  Ban,
  BookX,
  Braces,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Compass,
  FileSearch,
  Hourglass,
  ListChecks,
  Mic,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Target,
  TriangleAlert,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AnswerDecision, TrustCheckId } from './types'

export interface TrustCheckConfig {
  id: TrustCheckId
  name: string
  icon: LucideIcon
  description: string
}

export const TRUST_CHECKS: TrustCheckConfig[] = [
  {
    id: 'query-relevance',
    name: 'Query Relevance',
    icon: Target,
    description: 'Confirms the query belongs to the supported knowledge domain.',
  },
  {
    id: 'off-topic-detection',
    name: 'Off-topic Detection',
    icon: Compass,
    description: 'Flags queries that fall outside the provided knowledge base.',
  },
  {
    id: 'safety-check',
    name: 'Safety Check',
    icon: ShieldAlert,
    description: 'Blocks harmful, abusive or unsafe prompts and outputs.',
  },
  {
    id: 'retrieval-confidence',
    name: 'Retrieval Confidence',
    icon: Anchor,
    description: 'Verifies retrieved evidence is confident enough to answer.',
  },
  {
    id: 'grounding-verification',
    name: 'Grounding Verification',
    icon: CircleCheck,
    description: 'Confirms the answer is supported by retrieved context.',
  },
  {
    id: 'hallucination-check',
    name: 'Hallucination Check',
    icon: TriangleAlert,
    description: 'Flags content that cannot be traced back to source evidence.',
  },
  {
    id: 'output-validation',
    name: 'Output Validation',
    icon: FileSearch,
    description: 'Validates the final response format, language and structure.',
  },
]

export interface TrustPipelineStage {
  id: string
  name: string
  icon: LucideIcon
  description: string
}

export const TRUST_PIPELINE: TrustPipelineStage[] = [
  {
    id: 'user-query',
    name: 'User Query',
    icon: Mic,
    description: 'The incoming question.',
  },
  {
    id: 'input-validation',
    name: 'Input Validation',
    icon: ListChecks,
    description: 'Sanitize and validate the query input.',
  },
  {
    id: 'relevance-check',
    name: 'Relevance Check',
    icon: Target,
    description: 'Is the question in-scope for the knowledge base?',
  },
  {
    id: 'safety-check',
    name: 'Safety Check',
    icon: ShieldAlert,
    description: 'Is the request safe to process?',
  },
  {
    id: 'retrieval',
    name: 'Retrieval',
    icon: ScanSearch,
    description: 'Fetch supporting context from the knowledge base.',
  },
  {
    id: 'context-validation',
    name: 'Context Validation',
    icon: Braces,
    description: 'Is there enough retrieved context to answer?',
  },
  {
    id: 'answer-generation',
    name: 'Answer Generation',
    icon: Sparkles,
    description: 'Generate an answer from the retrieved context.',
  },
  {
    id: 'grounding-check',
    name: 'Grounding Check',
    icon: CircleCheck,
    description: 'Is every claim supported by evidence?',
  },
  {
    id: 'output-validation',
    name: 'Output Validation',
    icon: FileSearch,
    description: 'Validate format, language and structure.',
  },
  {
    id: 'final-response',
    name: 'Final Response',
    icon: BadgeCheck,
    description: 'Deliver the trusted answer.',
  },
]

export const ANSWER_DECISIONS: Array<{
  id: AnswerDecision
  label: string
  icon: LucideIcon
}> = [
  { id: 'waiting', label: 'Waiting', icon: Hourglass },
  { id: 'answer', label: 'Answer', icon: CircleCheck },
  { id: 'refuse', label: 'Refuse', icon: Ban },
  { id: 'insufficient-context', label: 'Insufficient Context', icon: BookX },
  { id: 'unsafe-query', label: 'Unsafe Query', icon: ShieldX },
  { id: 'off-topic', label: 'Off-topic', icon: Compass },
  { id: 'error', label: 'Error', icon: CircleAlert },
]

export const SAFETY_PRINCIPLES: Array<{ text: string; icon: LucideIcon }> = [
  { text: 'Do not answer unsupported questions.', icon: CircleDashed },
  { text: 'Do not invent information.', icon: TriangleAlert },
  { text: 'Do not expose private information.', icon: ShieldCheck },
  { text: 'Refuse unsafe or inappropriate requests.', icon: ShieldX },
  { text: 'Prefer retrieved evidence over model memory.', icon: ScanSearch },
  { text: 'Clearly communicate uncertainty.', icon: CircleAlert },
]

export const GUARDRAIL_EVENT_COLUMNS = [
  'Time',
  'Query ID',
  'Check',
  'Result',
  'Reason',
  'Action',
]