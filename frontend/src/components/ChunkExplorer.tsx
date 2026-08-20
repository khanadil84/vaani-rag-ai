import { Database } from 'lucide-react'
import {
  CHUNK_COLUMNS,
  getStrategyName,
} from '../lib/retrieval/strategies'
import type { IndexedChunk } from '../lib/retrieval/types'
import { cn } from '../lib/utils'
import EmptyState from './EmptyState'
import RetrievalFilter from './RetrievalFilter'
import type { RetrievalFilterValues } from '../lib/retrieval/types'

interface ChunkExplorerProps {
  value: RetrievalFilterValues
  onChange: (next: RetrievalFilterValues) => void
  chunks?: IndexedChunk[]
  className?: string
}

export default function ChunkExplorer({
  value,
  onChange,
  chunks = [],
  className,
}: ChunkExplorerProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Chunk Explorer
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Inspect indexed chunks across every strategy.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
          -- chunks
        </span>
      </div>

      <RetrievalFilter value={value} onChange={onChange} />

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-night-950/50">
        {chunks.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No indexed chunks yet"
            description="Chunks will appear here once the knowledge base is indexed and the retrieval backend is connected."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[10px] tracking-widest text-slate-500 uppercase">
                  {CHUNK_COLUMNS.map((column) => (
                    <th key={column.key} className="px-4 py-3 font-semibold">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chunks.map((chunk) => (
                  <tr
                    key={chunk.chunkId}
                    className="border-b border-white/5 text-slate-300 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {chunk.documentId}
                    </td>
                    <td className="px-4 py-3">{chunk.language}</td>
                    <td className="px-4 py-3 font-mono text-cyan-accent">
                      {chunk.chunkId}
                    </td>
                    <td className="px-4 py-3">{getStrategyName(chunk.strategy)}</td>
                    <td className="px-4 py-3">{chunk.chunkSize}</td>
                    <td className="px-4 py-3">{chunk.overlap}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {chunk.similarityScore ?? '--'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {chunk.rerankScore ?? '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Columns ready for the indexing backend
        </p>
        <div className="flex flex-wrap gap-2">
          {CHUNK_COLUMNS.map((column) => (
            <span
              key={column.key}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400"
            >
              {column.label}
              <code className="ml-1.5 font-mono text-[10px] text-slate-600">
                {column.key}
              </code>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}