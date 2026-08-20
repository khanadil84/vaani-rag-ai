import { useCallback, useEffect, useRef, useState } from 'react'
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
  const mountedRef = useRef(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    const load = async () => {
      const [healthRes, metricsRes] = await Promise.all([
        api.health(),
        api.analytics(),
      ])

      if (healthRes.ok && healthRes.data) {
        setHealth(healthRes.data)
        setStatus(healthRes.data.status)
      } else if (healthRes.error) {
        setError(healthRes.error)
        setStatus('offline')
      }

      if (metricsRes.ok && metricsRes.data) {
        setMetrics(metricsRes.data)
      }
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
    mountedRef.current = true
    void refresh().finally(() => {
      if (mountedRef.current) setLoading(false)
    })
    return () => {
      mountedRef.current = false
    }
  }, [refresh])

  return { status, health, metrics, loading, error, refresh }
}