import { Bell, Menu, Search, User } from 'lucide-react'
import { useBackendStatus } from '../hooks/useBackendStatus'
import { cn } from '../lib/utils'
import StatusBadge from './StatusBadge'

interface TopNavProps {
  onOpenSidebar: () => void
  title: string
}

export default function TopNav({ onOpenSidebar, title }: TopNavProps) {
  const { status } = useBackendStatus()
  return (
    <header
      className="glass-strong sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-x-0 border-t-0 px-4 sm:px-6"
      aria-label="Top navigation"
    >
      <button
        type="button"
        onClick={onOpenSidebar}
        className="focus-ring rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-base font-semibold tracking-tight text-white sm:text-lg">
          {title}
        </h1>
      </div>

      <div className="relative hidden md:block">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search workspace"
          aria-label="Search workspace"
          className="focus-ring w-56 rounded-xl border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-sm text-slate-200 placeholder:text-slate-500"
        />
      </div>

      <StatusBadge status={status} className="hidden sm:inline-flex" />

      <button
        type="button"
        className="focus-ring relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        <span
          className="absolute top-1.5 right-1.5 size-2 rounded-full bg-cyan-accent"
          aria-hidden="true"
        />
      </button>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-full',
            'bg-gradient-to-br from-cyan-accent/30 to-violet-accent/30 text-white ring-1 ring-white/15',
          )}
          aria-hidden="true"
        >
          <User className="size-4" />
        </div>
        <div className="hidden text-left xl:block">
          <p className="text-xs font-semibold leading-tight text-white">Operator</p>
          <p className="text-[11px] leading-tight text-slate-500">vaani-rag-ai</p>
        </div>
      </div>
    </header>
  )
}