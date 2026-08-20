import { Boxes, Database, FileText, Languages } from 'lucide-react'
import { cn } from '../lib/utils'

const STATS = [
  { label: 'Documents', icon: FileText },
  { label: 'Chunks', icon: Boxes },
  { label: 'Languages', icon: Languages },
  { label: 'Indexed', icon: Database },
]

interface KnowledgeBaseStatsProps {
  className?: string
}

export default function KnowledgeBaseStats({
  className,
}: KnowledgeBaseStatsProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {STATS.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="glass card-hover rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                {stat.label}
              </span>
              <div
                className="rounded-lg bg-cyan-accent/10 p-1.5 text-cyan-accent"
                aria-hidden="true"
              >
                <Icon className="size-4" />
              </div>
            </div>
            <p className="mt-3 font-mono text-2xl text-slate-300">--</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Streamed from the indexing backend when connected.
            </p>
          </div>
        )
      })}
    </div>
  )
}