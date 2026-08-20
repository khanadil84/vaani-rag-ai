import { cn } from '../lib/utils'

interface NeutralStatusBadgeProps {
  label: string
  className?: string
}

export default function NeutralStatusBadge({
  label,
  className,
}: NeutralStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-semibold tracking-widest text-slate-400 uppercase',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-slate-500" aria-hidden="true" />
      {label}
    </span>
  )
}