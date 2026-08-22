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

let sharedRequest: Promise<void> | null = null

export function useBackendStatus(): BackendStatus {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [status, setStatus] = useState<SystemStatus>('unconnected')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    const load = async () => {
      const metricsRes = await api.analytics()

      if (metricsRes.ok && metricsRes.data) {
        setMetrics(metricsRes.data)

        const operationalHealth: HealthResponse = {
          status: 'operational',
          version: '0.1.0',
          uptime: metricsRes.data.uptimeSeconds,
          service: 'VaaniRAG AI Backend',
        }

        setHealth(operationalHealth)
        setStatus('operational')
        return
      }

      setStatus('offline')
      setError(
        metricsRes.error ?? 'Backend is unavailable',
      )
    }

    if (sharedRequest) {
      await sharedRequest
      return
    }

    sharedRequest = load()

    try {
      await sharedRequest
    } finally {
      sharedRequest = null
    }
  }, [])

  useEffect(() => {
    void refresh().finally(() => {
      setLoading(false)
    })
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