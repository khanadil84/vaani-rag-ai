import { Languages, LoaderCircle } from 'lucide-react'
import { PLACEHOLDER_LANGUAGE_PILLS } from '../lib/knowledge/config'
import { cn } from '../lib/utils'

const PILL_WIDTHS = [
  'w-16',
  'w-20',
  'w-14',
  'w-18',
  'w-16',
  'w-22',
  'w-15',
  'w-19',
]

interface LanguageCoverageProps {
  className?: string
}

export default function LanguageCoverage({ className }: LanguageCoverageProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl bg-violet-accent/10 p-2.5 text-violet-soft ring-1 ring-violet-accent/20"
            aria-hidden="true"
          >
            <Languages className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-white">
              Language Coverage
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-400">
              Languages supported by the knowledge base.
            </p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
          -- languages
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {Array.from({ length: PLACEHOLDER_LANGUAGE_PILLS }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'flex h-8 items-center justify-center rounded-full border border-dashed border-white/10 bg-white/[0.03] px-3',
              PILL_WIDTHS[index % PILL_WIDTHS.length],
            )}
            aria-hidden="true"
          >
            <span className="size-1.5 rounded-full bg-slate-600" />
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
          <LoaderCircle className="size-3.5 animate-spin text-slate-500" aria-hidden="true" />
          Awaiting dataset metadata
        </span>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Language coverage will be populated from the dataset metadata during
        indexing.
      </p>
    </section>
  )
}