import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { HealthResponse, MetricsResponse } from '../lib/api'
import type { SystemStatus } from '../types'

export interface BackendStatus {
  status: SystemStatus
  health: HealthResponse | null
  metrics: MetricsResponse | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useBackendStatus(): BackendStatus {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [status, setStatus] = useState<SystemStatus>('unconnected')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const healthRes = await api.health()

      if (!healthRes.ok || !healthRes.data) {
        setStatus('offline')
        setError(healthRes.error ?? 'Backend health check failed')
        return
      }

      setHealth(healthRes.data)
      setStatus('operational')

      // Metrics are optional. A metrics failure must NOT make
      // a healthy backend appear offline.
      const metricsRes = await api.analytics()

      if (metricsRes.ok && metricsRes.data) {
        setMetrics(metricsRes.data)
      }
    } catch (err) {
      setStatus('offline')
      setError(
        err instanceof Error ? err.message : 'Backend connection failed',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    status,
    health,
    metrics,
    loading,
    error,
    refresh,
  }
}