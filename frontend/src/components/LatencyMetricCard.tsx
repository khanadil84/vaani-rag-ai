import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface LatencyMetricCardProps {
  label: string
  icon: LucideIcon
  value: string
  unit?: string
  caption: string
  accent?: 'cyan' | 'violet' | 'saffron'
  className?: string
}

const ACCENTS: Record<string, string> = {
  cyan: 'text-cyan-accent bg-cyan-accent/10 ring-cyan-accent/20',
  violet: 'text-violet-soft bg-violet-accent/10 ring-violet-accent/20',
  saffron: 'text-saffron-accent bg-saffron-accent/10 ring-saffron-accent/20',
}

export default function LatencyMetricCard({
  label,
  icon: Icon,
  value,
  unit,
  caption,
  accent = 'cyan',
  className,
}: LatencyMetricCardProps) {
  const isPlaceholder = value === '--'
  return (
    <article className={cn('glass card-hover rounded-2xl p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-400">{label}</p>
        <div className={cn('rounded-lg p-2 ring-1', ACCENTS[accent])} aria-hidden="true">
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
        {value}
        {unit && !isPlaceholder && (
          <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </article>
  )
}