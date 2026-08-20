import { ArrowRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NAV_ITEMS } from '../config/navigation'
import { cn } from '../lib/utils'
import type { RouteId } from '../types'
import Logo from './Logo'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  active: RouteId
  onNavigate: (id: RouteId) => void
}

export default function Sidebar({ collapsed, onToggle, active, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/10',
        'bg-night-900/70 backdrop-blur-2xl transition-[width] duration-300 ease-out',
        collapsed ? 'w-[76px]' : 'w-64',
      )}
      aria-label="Primary navigation"
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-white/5',
          collapsed ? 'justify-center px-3' : 'justify-between px-4',
        )}
      >
        <Logo compact={collapsed} />
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'focus-ring rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white',
            collapsed && 'hidden',
          )}
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.id === active
          return (
            <a
              key={item.id}
              href={`#/${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(item.id)
              }}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group focus-ring relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors active:scale-[0.98]',
                isActive
                  ? 'bg-gradient-to-r from-cyan-accent/15 to-violet-accent/15 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
                collapsed && 'justify-center px-0',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span
                  className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-accent to-violet-accent"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={cn(
                  'size-[18px] shrink-0 transition-colors',
                  isActive ? 'text-cyan-accent' : 'text-slate-500 group-hover:text-slate-300',
                )}
                aria-hidden="true"
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && isActive && (
                <ArrowRight
                  className="ml-auto size-3.5 text-cyan-accent/70"
                  aria-hidden="true"
                />
              )}
            </a>
          )
        })}
      </nav>

      <div
        className={cn(
          'shrink-0 border-t border-white/5 px-4 py-3',
          collapsed && 'px-2',
        )}
      >
        {!collapsed && (
          <p className="mb-2 px-1 text-[11px] font-medium tracking-widest text-slate-500 uppercase">
            Built for Bharat
          </p>
        )}
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <span
            className="size-2 shrink-0 rounded-full bg-saffron-accent"
            aria-hidden="true"
          />
          {!collapsed && (
            <span className="truncate text-xs text-slate-400">vaani-rag-ai</span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'focus-ring mt-3 w-full rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white',
            'hidden md:flex',
            collapsed ? 'justify-center' : 'justify-end',
          )}
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen className="size-4" />
        </button>
      </div>
    </aside>
  )
}