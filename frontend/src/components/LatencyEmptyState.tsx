import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface LatencyEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export default function LatencyEmptyState({
  icon: Icon,
  title,
  description,
  className,
}: LatencyEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-14 text-center',
        className,
      )}
    >
      <div className="relative" aria-hidden="true">
        <span className="absolute -inset-3 rounded-full border border-dashed border-cyan-accent/25 animate-spin-slow" />
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
          <Icon className="size-6" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-cyan-accent animate-pulse" />
      </div>
      <p className="mt-5 text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  )
}