import { CheckCircle2 } from 'lucide-react'
import { cn } from '../lib/utils'
import type { SystemStatus } from '../types'

const STATUS_META: Record<
  SystemStatus,
  { label: string; dot: string; text: string; pill: string }
> = {
  unconnected: {
    label: 'Backend Not Connected',
    dot: 'bg-slate-400',
    text: 'text-slate-300',
    pill: 'border-white/10 bg-white/5',
  },
  operational: {
    label: 'System Operational',
    dot: 'bg-emerald-400 animate-pulse-dot',
    text: 'text-emerald-300',
    pill: 'border-emerald-400/25 bg-emerald-400/10',
  },
  degraded: {
    label: 'System Degraded',
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    pill: 'border-amber-400/25 bg-amber-400/10',
  },
  offline: {
    label: 'System Offline',
    dot: 'bg-rose-500',
    text: 'text-rose-300',
    pill: 'border-rose-400/25 bg-rose-400/10',
  },
}

interface StatusBadgeProps {
  status?: SystemStatus
  size?: 'sm' | 'md'
  className?: string
}

export default function StatusBadge({
  status = 'unconnected',
  size = 'md',
  className,
}: StatusBadgeProps) {
  const meta = STATUS_META[status]
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1',
        meta.pill,
        size === 'sm' ? 'text-[11px]' : 'text-xs',
        className,
      )}
    >
      <span
        className={cn(
          'size-2 shrink-0 rounded-full',
          size === 'sm' ? 'size-1.5' : '',
          meta.dot,
        )}
        aria-hidden="true"
      />
      <span className={cn('font-semibold tracking-wide', meta.text)}>{meta.label}</span>
      {status === 'operational' && (
        <CheckCircle2 className="size-3.5 text-emerald-300" aria-hidden="true" />
      )}
    </div>
  )
}