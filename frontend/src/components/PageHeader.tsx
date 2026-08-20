import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  description: string
  eyebrow?: string
  accent?: 'cyan' | 'violet' | 'saffron'
  className?: string
}

const ACCENTS: Record<string, string> = {
  cyan: 'text-cyan-accent bg-cyan-accent/10 ring-cyan-accent/20',
  violet: 'text-violet-soft bg-violet-accent/10 ring-violet-accent/20',
  saffron: 'text-saffron-accent bg-saffron-accent/10 ring-saffron-accent/20',
}

export default function PageHeader({
  icon: Icon,
  title,
  description,
  eyebrow,
  accent = 'cyan',
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('animate-rise', className)}>
      {eyebrow && (
        <p className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
          {eyebrow}
        </p>
      )}
      <div className="flex items-center gap-3">
        <div
          className={cn('rounded-xl p-2.5 ring-1', ACCENTS[accent])}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 max-w-2xl text-[13px] leading-snug text-slate-400 sm:text-sm">
            {description}
          </p>
        </div>
      </div>
    </header>
  )
}