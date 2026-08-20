import { DatabaseZap, LoaderCircle } from 'lucide-react'
import { cn } from '../lib/utils'

interface IndexStatusProps {
  className?: string
}

export default function IndexStatus({ className }: IndexStatusProps) {
  return (
    <section
      className={cn(
        'glass card-hover relative overflow-hidden rounded-2xl p-5 sm:p-6',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -top-32 -left-24 size-72 rounded-full bg-violet-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-white">
              Knowledge Base Status
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-400">
              Overall indexing state of the dataset.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-slate-500" aria-hidden="true" />
            Not indexed
          </span>
        </div>

        <div className="mt-5 flex flex-col items-center rounded-2xl border border-white/10 bg-night-950/50 px-6 py-10 text-center">
          <div
            className="relative size-24"
            role="status"
            aria-label="Indexing progress not started"
          >
            <span className="absolute -inset-2 rounded-full border border-dashed border-slate-600/40 animate-spin-slow" />
            <div className="flex size-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-500">
              <DatabaseZap className="size-9" />
            </div>
          </div>
          <p className="mt-6 font-display text-2xl font-semibold tracking-tight text-white">
            NOT INDEXED
          </p>
          <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-slate-400">
            The knowledge base will become available after the dataset ingestion
            and indexing pipeline is connected.
          </p>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
              Indexing progress
            </span>
            <span className="text-[11px] text-slate-600">-- %</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            aria-valuetext="No indexing progress to show yet"
          >
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-accent to-violet-accent" />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
            No indexing progress to show yet.
          </p>
        </div>
      </div>
    </section>
  )
}