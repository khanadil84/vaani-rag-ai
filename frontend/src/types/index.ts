export type RouteId =
  | 'overview'
  | 'voice-playground'
  | 'rag-pipeline'
  | 'retrieval-lab'
  | 'latency-observatory'
  | 'trust-safety'
  | 'knowledge-base'
  | 'settings'

export type SystemStatus = 'unconnected' | 'operational' | 'degraded' | 'offline'
