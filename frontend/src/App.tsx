import { useEffect, useMemo, useState } from 'react'
import AppShell from './components/AppShell'
import ModulePage from './components/ModulePage'
import VoiceCommandCenter from './components/VoiceCommandCenter'
import { getNavItem, NAV_ITEMS } from './config/navigation'
import { MODULE_CONFIG } from './config/modules'
import Overview from './pages/Overview'
import RagPipeline from './pages/RagPipeline'
import RetrievalLab from './pages/RetrievalLab'
import LatencyObservatory from './pages/LatencyObservatory'
import TrustSafety from './pages/TrustSafety'
import KnowledgeBase from './pages/KnowledgeBase'
import SettingsPage from './pages/Settings'
import type { RouteId } from './types'

function parseRoute(): RouteId {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const match = NAV_ITEMS.find((item) => item.id === hash)
  return match?.id ?? 'overview'
}

export default function App() {
  const [route, setRoute] = useState<RouteId>(parseRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleNavigate = (id: RouteId) => {
    window.location.hash = `/${id}`
    setRoute(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const item = getNavItem(route)
  const config = MODULE_CONFIG[route]

  const content = useMemo(() => {
    if (route === 'overview') {
      return <Overview onNavigate={handleNavigate} />
    }

    if (route === 'rag-pipeline') {
      return <RagPipeline />
    }

    if (route === 'retrieval-lab') {
      return <RetrievalLab />
    }

    if (route === 'latency-observatory') {
      return <LatencyObservatory />
    }

    if (route === 'trust-safety') {
      return <TrustSafety />
    }

    if (route === 'knowledge-base') {
      return <KnowledgeBase />
    }

    if (route === 'settings') {
      return <SettingsPage />
    }

    return (
      <ModulePage
        icon={item.icon}
        title={item.label}
        description={item.description}
        eyebrow={config.eyebrow}
        accent={config.accent}
        apiEndpoints={item.apiEndpoints}
        features={config.features}
      >
        {route === 'voice-playground' && (
          <VoiceCommandCenter className="animate-rise [animation-delay:120ms]" />
        )}
      </ModulePage>
    )
  }, [route, item, config])

  return (
    <AppShell active={route} title={item.label} onNavigate={handleNavigate}>
      {content}
    </AppShell>
  )
}