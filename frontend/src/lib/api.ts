/**
 * VaaniRAG AI API client.
 *
 * LOCAL BACKEND ONLY
 *
 * Backend:
 *   http://localhost:10000/api
 *
 * Endpoints:
 *   GET  /api/health
 *   GET  /api/metrics
 *   GET  /api/knowledge-base
 *   POST /api/query
 *   POST /api/stt
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

/*
 * LOCALHOST ONLY
 */
const LOCAL_BASE_URL = 'http://localhost:10000/api'

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(
      `${LOCAL_BASE_URL}${path}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        ...init,
      },
    )

    if (!res.ok) {
      let detail =
        `Request failed with status ${res.status}`

      try {
        const body =
          (await res.json()) as {
            detail?: string
            error?: string
          }

        if (body.detail) {
          detail = body.detail
        } else if (body.error) {
          detail = body.error
        }
      } catch {
        // Non-JSON response.
      }

      return {
        ok: false,
        data: null,
        error: detail,
      }
    }

    const data =
      (await res.json()) as T

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
   * LOCAL HEALTH
   */
  health: () =>
    request<HealthResponse>(
      '/health',
    ),

  /*
   * LOCAL METRICS
   */
  analytics: () =>
    request<MetricsResponse>(
      '/metrics',
    ),

  /*
   * LOCAL KNOWLEDGE BASE
   */
  knowledgeBase: () =>
    request<KnowledgeBaseResponse>(
      '/knowledge-base',
    ),

  /*
   * LOCAL SARVAM STT
   */
  transcribe: (
    payload: {
      audio: Blob
      language?: string
    },
  ) => {
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
                error?: string
                sarvam_response?: unknown
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
            ok: false as const,
            text: null,
            error: detail,
          }
        }

        const data =
          (await res.json()) as {
            transcript?: string
            text?: string
          }

        const transcript =
          data.transcript ||
          data.text ||
          ''

        if (!transcript.trim()) {
          return {
            ok: false as const,
            text: null,
            error:
              'Speech recognition returned an empty transcript.',
          }
        }

        return {
          ok: true as const,
          text: transcript,
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
   * LOCAL RAG QUERY
   */
  ragQuery: (
    payload: {
      query: string
      topK?: number
    },
  ) =>
    request<QueryResponse>(
      '/query',
      {
        method: 'POST',
        body: JSON.stringify(
          payload,
        ),
      },
    ),
}