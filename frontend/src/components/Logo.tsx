import { cn } from '../lib/utils'

interface LogoProps {
  compact?: boolean
  className?: string
}

export default function Logo({ compact = false, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10',
          'bg-gradient-to-br from-cyan-accent/20 via-night-800 to-violet-accent/25 shadow-lg shadow-violet-accent/10',
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none">
          <path
            d="M7 4 L12 17 L17 4"
            stroke="url(#logo-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 14 H19.5"
            stroke="url(#logo-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="logo-grad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22d3ee" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="truncate font-display text-[15px] font-bold leading-tight tracking-tight text-white">
            VaaniRAG <span className="text-gradient">AI</span>
          </p>
          <p className="truncate text-[11px] font-medium leading-tight text-slate-400">
            Voice. Retrieval. Intelligence.
          </p>
        </div>
      )}
    </div>
  )
}