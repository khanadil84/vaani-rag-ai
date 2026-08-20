import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      <div
        className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400"
        aria-hidden="true"
      >
        <Icon className="size-6" />
      </div>
      <p className="mt-4 text-sm font-semibold text-white">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}