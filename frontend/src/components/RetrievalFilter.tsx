import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  RETRIEVAL_LANGUAGES,
  RETRIEVAL_STRATEGIES,
  RETRIEVAL_THRESHOLD_OPTIONS,
  RETRIEVAL_TOPK_OPTIONS,
} from '../lib/retrieval/strategies'
import type { RetrievalFilterValues } from '../lib/retrieval/types'
import { cn } from '../lib/utils'

interface RetrievalFilterProps {
  value: RetrievalFilterValues
  onChange: (next: RetrievalFilterValues) => void
  className?: string
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
        {label}
      </span>
      <div className="relative">
        {children}
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
      </div>
    </label>
  )
}

const SELECT_CLASSES =
  'focus-ring w-full appearance-none rounded-xl border border-white/10 bg-night-900/80 py-2 pr-8 pl-3 text-xs text-slate-200 transition-colors hover:border-white/20'

export default function RetrievalFilter({
  value,
  onChange,
  className,
}: RetrievalFilterProps) {
  const set = (patch: Partial<RetrievalFilterValues>) =>
    onChange({ ...value, ...patch })

  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/[0.03] p-4', className)}>
      <div className="mb-3 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-cyan-accent" aria-hidden="true" />
        <p className="text-xs font-semibold tracking-widest text-slate-300 uppercase">
          Retrieval filters
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Strategy">
          <select
            value={value.strategy}
            onChange={(event) =>
              set({ strategy: event.target.value as RetrievalFilterValues['strategy'] })
            }
            className={SELECT_CLASSES}
          >
            <option value="">--</option>
            <option value="all">All strategies</option>
            {RETRIEVAL_STRATEGIES.map((strategy) => (
              <option key={strategy.id} value={strategy.id}>
                {strategy.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Language">
          <select
            value={value.language}
            onChange={(event) => set({ language: event.target.value })}
            className={SELECT_CLASSES}
          >
            <option value="">--</option>
            {RETRIEVAL_LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Top-K">
          <select
            value={value.topK ?? ''}
            onChange={(event) =>
              set({
                topK: event.target.value === '' ? null : Number(event.target.value),
              })
            }
            className={SELECT_CLASSES}
          >
            <option value="">--</option>
            {RETRIEVAL_TOPK_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Similarity threshold">
          <select
            value={value.similarityThreshold ?? ''}
            onChange={(event) =>
              set({
                similarityThreshold:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
            className={SELECT_CLASSES}
          >
            <option value="">--</option>
            {RETRIEVAL_THRESHOLD_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t.toFixed(1)}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  )
}