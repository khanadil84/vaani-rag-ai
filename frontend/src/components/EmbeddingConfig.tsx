import { SlidersHorizontal } from 'lucide-react'
import { EMBEDDING_FIELDS } from '../lib/knowledge/config'
import { cn } from '../lib/utils'

interface EmbeddingConfigProps {
  className?: string
}

export default function EmbeddingConfig({ className }: EmbeddingConfigProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div
          className="rounded-xl bg-cyan-accent/10 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/20"
          aria-hidden="true"
        >
          <SlidersHorizontal className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Embedding Configuration
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Vector settings for the future index.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {EMBEDDING_FIELDS.map((field) => {
          const Icon = field.icon
          return (
            <li
              key={field.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5"
            >
              <span className="flex items-center gap-2.5 text-[13px] text-slate-300">
                <Icon className="size-3.5 text-slate-500" aria-hidden="true" />
                {field.label}
              </span>
              <code className="font-mono text-[13px] text-slate-500">--</code>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-[11px] text-slate-500">
        Values are applied when the indexing pipeline is connected.
      </p>
    </section>
  )
}