/**
 * Trust & Safety data model — API-ready for the future guardrail backend.
 * Unmeasured values are `null` and rendered as "--" by the UI; nothing is
 * fabricated.
 */

export type TrustCheckId =
  | 'query-relevance'
  | 'off-topic-detection'
  | 'safety-check'
  | 'retrieval-confidence'
  | 'grounding-verification'
  | 'hallucination-check'
  | 'output-validation'

export type TrustCheckStatus = 'waiting' | 'pass' | 'fail' | 'skip'

export interface GuardrailCheck {
  id: TrustCheckId
  name: string
  status: TrustCheckStatus
  latencyMs: number | null
  reason: string | null
}

export type AnswerDecision =
  | 'waiting'
  | 'answer'
  | 'refuse'
  | 'insufficient-context'
  | 'unsafe-query'
  | 'off-topic'
  | 'error'

export interface TrustEvaluation {
  queryId: string
  checks: GuardrailCheck[]
  decision: AnswerDecision
  groundingScore: number | null
  confidence: number | null
  timestamp: string
}

export interface GuardrailEvent {
  timestamp: string
  queryId: string
  check: TrustCheckId
  result: 'pass' | 'fail' | 'skip'
  reason: string
  action: string
}