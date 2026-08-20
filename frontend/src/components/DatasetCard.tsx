import { BookOpenCheck, Database } from 'lucide-react'
import { cn } from '../lib/utils'
import NeutralStatusBadge from './NeutralStatusBadge'

interface DatasetCardProps {
  className?: string
}

export default function DatasetCard({ className }: DatasetCardProps) {
  return (
    <section
      className={cn(
        'glass card-hover relative overflow-hidden rounded-2xl p-5 sm:p-6',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-cyan-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="rounded-xl bg-gradient-to-br from-cyan-accent/20 to-violet-accent/20 p-3 text-cyan-accent ring-1 ring-cyan-accent/25"
            aria-hidden="true"
          >
            <Database className="size-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Dataset
            </p>
            <h2 className="font-display text-xl font-semibold tracking-tight text-white">
              MSMARCO-XI
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
              <BookOpenCheck className="size-3.5" aria-hidden="true" />
              Provider: AI4Bharat
            </p>
          </div>
        </div>
        <NeutralStatusBadge label="Not indexed" />
      </div>
      <p className="relative mt-4 max-w-2xl text-[13px] leading-relaxed text-slate-400">
        Multilingual information retrieval dataset used as the knowledge source
        for VaaniRAG AI.
      </p>
    </section>
  )
}