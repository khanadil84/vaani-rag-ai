import { LoaderCircle, TriangleAlert } from 'lucide-react'
import type { PipelineStatus } from '../lib/pipeline/types'
import { cn } from '../lib/utils'

const STATUS_META: Record<
  PipelineStatus,
  { label: string; className: string; dot: string }
> = {
  idle: {
    label: 'Idle',
    className: 'border-white/10 bg-white/5 text-slate-400',
    dot: 'bg-slate-500',
  },
  processing: {
    label: 'Processing',
    className: 'border-cyan-accent/30 bg-cyan-accent/10 text-cyan-accent',
    dot: 'bg-cyan-accent animate-pulse',
  },
  completed: {
    label: 'Completed',
    className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  error: {
    label: 'Error',
    className: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
    dot: 'bg-rose-400',
  },
}

interface PipelineStatusBadgeProps {
  status: PipelineStatus
  latencyMs: number | null
  className?: string
}

export default function PipelineStatusBadge({
  status,
  latencyMs,
  className,
}: PipelineStatusBadgeProps) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide',
        meta.className,
        className,
      )}
    >
      {status === 'processing' ? (
        <LoaderCircle className="size-3 animate-spin" aria-hidden="true" />
      ) : status === 'error' ? (
        <TriangleAlert className="size-3" aria-hidden="true" />
      ) : (
        <span className={cn('size-1.5 rounded-full', meta.dot)} aria-hidden="true" />
      )}
      <span className="uppercase">{meta.label}</span>
      <span className="opacity-60">·</span>
      <span className="font-mono tabular-nums">
        {latencyMs !== null ? `${latencyMs} ms` : '-- ms'}
      </span>
    </span>
  )
}