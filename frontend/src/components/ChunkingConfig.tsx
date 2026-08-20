import { Scissors } from 'lucide-react'
import { CHUNKING_STRATEGIES } from '../lib/knowledge/config'
import { cn } from '../lib/utils'
import NeutralStatusBadge from './NeutralStatusBadge'

interface ChunkingConfigProps {
  className?: string
}

export default function ChunkingConfig({ className }: ChunkingConfigProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div
          className="rounded-xl bg-saffron-accent/10 p-2.5 text-saffron-accent ring-1 ring-saffron-accent/20"
          aria-hidden="true"
        >
          <Scissors className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Chunking Configuration
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Strategies VaaniRAG AI will support.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {CHUNKING_STRATEGIES.map((strategy) => {
          const Icon = strategy.icon
          return (
            <li
              key={strategy.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 transition-colors hover:border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="size-4 text-slate-500" aria-hidden="true" />
                <div>
                  <p className="text-[13px] font-semibold text-slate-200">
                    {strategy.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {strategy.description}
                  </p>
                </div>
              </div>
              <NeutralStatusBadge label="Planned" />
            </li>
          )
        })}
      </ul>
    </section>
  )
}