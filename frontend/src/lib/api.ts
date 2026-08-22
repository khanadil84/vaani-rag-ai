/**
 * VaaniRAG AI API client.
 *
 * Local FastAPI:
 *   /api/health
 *   /api/metrics
 *   /api/knowledge-base
 *   /api/stt
 *
 * Production Vercel RAG:
 *   https://vaani-rag-ai.vercel.app/api/query
 *
 * Secrets are never stored here.
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
  deployment?: string
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

const LOCAL_BASE_URL = 'https://vaani-rag-backend.onrender.com/api'

const VERCEL_QUERY_URL =
  'https://vaani-rag-ai.vercel.app/api/query'

async function request<T>(
  path: string,
  init?: RequestInit,
  baseUrl: string = LOCAL_BASE_URL,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...init,
    })

    if (!res.ok) {
      let detail = `Request failed with status ${res.status}`

      try {
        const body = (await res.json()) as {
          detail?: string
          error?: string
        }

        if (body.detail) {
          detail = body.detail
        } else if (body.error) {
          detail = body.error
        }
      } catch {
        // Non-JSON error response.
      }

      return {
        ok: false,
        data: null,
        error: detail,
      }
    }

    const data = (await res.json()) as T

    return {
      ok: true,
      data,
      error: null,
    }
  } catch (err) {
    return {
      ok: false,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : 'Network error',
    }
  }
}

export const api = {
  /*
   * Local FastAPI backend.
   */
  health: () =>
    request<HealthResponse>('/health'),

  analytics: () =>
    request<MetricsResponse>('/metrics'),

  knowledgeBase: () =>
    request<KnowledgeBaseResponse>(
      '/knowledge-base',
    ),

  /*
   * Local Sarvam STT backend.
   */
  transcribe: (payload: { audio: Blob }) => {
    const form = new FormData()

    form.append(
      'file',
      payload.audio,
      'recording.wav',
    )

    return fetch(
      `${LOCAL_BASE_URL}/stt`,
      {
        method: 'POST',
        body: form,
      },
    )
      .then(async (res) => {
        if (!res.ok) {
          let detail =
            `Request failed with status ${res.status}`

          try {
            const body =
              (await res.json()) as {
                detail?: string
              }

            if (body.detail) {
              detail = body.detail
            }
          } catch {
            // Non-JSON error response.
          }

          return {
            ok: false as const,
            text: null,
            error: detail,
          }
        }

        const data =
          (await res.json()) as {
            transcript: string
          }

        return {
          ok: true as const,
          text: data.transcript,
          error: null,
        }
      })
      .catch((err: unknown) => ({
        ok: false as const,
        text: null,
        error:
          err instanceof Error
            ? err.message
            : 'Network error',
      }))
  },

  /*
   * Production VaaniRAG query.
   *
   * This uses the verified Vercel endpoint.
   */
  ragQuery: (
    payload: {
      query: string
      topK?: number
    },
  ) =>
    request<QueryResponse>(
      '',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      VERCEL_QUERY_URL,
    ),
}
