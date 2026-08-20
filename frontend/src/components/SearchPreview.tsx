import { Search } from 'lucide-react'
import { cn } from '../lib/utils'

interface SearchPreviewProps {
  className?: string
}

export default function SearchPreview({ className }: SearchPreviewProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div
          className="rounded-xl bg-violet-accent/10 p-2.5 text-violet-soft ring-1 ring-violet-accent/20"
          aria-hidden="true"
        >
          <Search className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Search the knowledge base
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Semantic search preview.
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-night-950/50 px-3.5 py-3 opacity-70"
        aria-disabled="true"
      >
        <Search className="size-4 shrink-0 text-slate-600" aria-hidden="true" />
        <span className="flex-1 text-[13px] text-slate-600">
          Knowledge base is not indexed yet.
        </span>
        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Disabled
        </span>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        Search will activate once the vector index is connected.
      </p>
    </section>
  )
}