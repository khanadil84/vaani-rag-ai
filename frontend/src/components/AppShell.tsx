import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../lib/utils'
import type { RouteId } from '../types'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

interface AppShellProps {
  active: RouteId
  title: string
  onNavigate: (id: RouteId) => void
  children: ReactNode
}

export default function AppShell({
  active,
  title,
  onNavigate,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const handleNavigate = (id: RouteId) => {
    onNavigate(id)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        active={active}
        onNavigate={handleNavigate}
      />

      {mobileOpen && (
        <div className="fixed inset-0 z-20 lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-night-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          />
          <Sidebar
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
            active={active}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300 ease-out',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-64',
        )}
      >
        <TopNav title={title} onOpenSidebar={() => setMobileOpen(true)} />

        <main
          className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>

        <footer className="border-t border-white/5 px-4 py-4 text-center sm:px-6">
          <p className="text-[11px] text-slate-600">
            VaaniRAG AI · Voice. Retrieval. Intelligence — Built for Bharat.
          </p>
        </footer>
      </div>
    </div>
  )
}