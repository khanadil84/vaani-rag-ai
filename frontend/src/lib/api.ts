/**
 * VaaniRAG AI API client — wired to the live FastAPI backend.
 *
 * Endpoints:
 *   POST /api/query     run a query through the RAG pipeline
 *   GET  /api/health    backend health + component status
 *   GET  /api/metrics   aggregate runtime metrics
 *   POST /api/stt       Sarvam speech-to-text
 *
 * Secrets are never stored here — all keys stay in the backend (.env).
 */

export interface ApiResult<T> {
  ok: boolean
  data: T | null
  error: string | null
}

export interface HealthComponent {
  status: string
  reason?: string
  model?: string
}

export interface HealthResponse {
  status: 'operational' | 'degraded' | 'offline'
  version: string
  uptime: number
  service?: string
  components?: Record<string, HealthComponent>
}

export interface QueryResponse {
  query: string
  answer: string | null
  grounded: boolean
  guardrail_reason: string | null
  evidence_count: number
  retrieval_ms: number | null
  rerank_ms: number | null
  gemini_ms: number | null
  total_ms: number | null
}

export interface MetricsResponse {
  queriesProcessed: number
  transcriptions: number
  avgLatencyMs: number | null
  sourcesIndexed: number
  guardrailBlocks: number
  uptimeSeconds: number
  lastQuery: QueryResponse | null
}

export interface AnalyticsResponse {
  queriesProcessed: number
  transcriptions: number
  avgLatencyMs: number | null
  sourcesIndexed: number
}

export interface KnowledgeBaseResponse {
  documents: unknown[]
}

const BASE_URL = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
    if (!res.ok) {
      let detail = `Request failed with status ${res.status}`
      try {
        const body = (await res.json()) as { detail?: string }
        if (body.detail) detail = body.detail
      } catch {
        // non-JSON error body
      }
      return { ok: false, data: null, error: detail }
    }
    const data = (await res.json()) as T
    return { ok: true, data, error: null }
  } catch (err) {
    return {
      ok: false,
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}

export const api = {
  health: () => request<HealthResponse>('/health'),
  analytics: () => request<MetricsResponse>('/metrics'),
  knowledgeBase: () => request<KnowledgeBaseResponse>('/knowledge-base'),
  transcribe: (payload: { audio: Blob }) => {
    const form = new FormData()
    form.append('file', payload.audio, 'recording.wav')
    return fetch(`${BASE_URL}/stt`, { method: 'POST', body: form })
      .then(async (res) => {
        if (!res.ok) {
          let detail = `Request failed with status ${res.status}`
          try {
            const body = (await res.json()) as { detail?: string }
            if (body.detail) detail = body.detail
          } catch {
            // non-JSON error body
          }
          return { ok: false as const, text: null, error: detail }
        }
        const data = (await res.json()) as { transcript: string }
        return { ok: true as const, text: data.transcript, error: null }
      })
      .catch((err: unknown) => ({
        ok: false as const,
        text: null,
        error: err instanceof Error ? err.message : 'Network error',
      }))
  },
  ragQuery: (payload: { query: string; topK?: number }) =>
    request<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}