import { FolderSearch } from 'lucide-react'
import { DOCUMENT_EXPLORER_COLUMNS } from '../lib/knowledge/config'
import type { DocumentRecord } from '../lib/knowledge/types'
import { cn } from '../lib/utils'
import EmptyState from './EmptyState'

interface DocumentExplorerProps {
  documents?: DocumentRecord[]
  className?: string
}

export default function DocumentExplorer({
  documents = [],
  className,
}: DocumentExplorerProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Document Explorer
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Browse indexed documents from the dataset.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
          -- documents
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-night-950/50">
        {documents.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title="No documents indexed yet"
            description="Indexed documents will appear here once the dataset pipeline is connected."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[10px] tracking-widest text-slate-500 uppercase">
                  {DOCUMENT_EXPLORER_COLUMNS.map((column) => (
                    <th key={column} className="px-4 py-3 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.documentId}
                    className="border-b border-white/5 text-slate-300 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-cyan-accent">
                      {doc.documentId}
                    </td>
                    <td className="px-4 py-3">{doc.language}</td>
                    <td className="px-4 py-3">{doc.query}</td>
                    <td className="px-4 py-3">{doc.passage}</td>
                    <td className="px-4 py-3">{doc.chunkCount ?? '--'}</td>
                    <td className="px-4 py-3">{doc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}