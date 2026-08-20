import { ScrollText } from 'lucide-react'
import { GUARDRAIL_EVENT_COLUMNS } from '../lib/safety/config'
import type { GuardrailEvent } from '../lib/safety/types'
import { cn } from '../lib/utils'
import EmptyState from './EmptyState'

interface GuardrailEventLogProps {
  events?: GuardrailEvent[]
  className?: string
}

export default function GuardrailEventLog({
  events = [],
  className,
}: GuardrailEventLogProps) {
  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Guardrail Event Log
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Every check decision, ready for live events from the backend.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
          -- events
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-night-950/50">
        {events.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="No guardrail events yet"
            description="Guardrail decisions will stream into this log once the backend is connected."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[10px] tracking-widest text-slate-500 uppercase">
                  {GUARDRAIL_EVENT_COLUMNS.map((column) => (
                    <th key={column} className="px-4 py-3 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr
                    key={`${event.timestamp}-${index}`}
                    className="border-b border-white/5 text-slate-300 last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {event.timestamp}
                    </td>
                    <td className="px-4 py-3 font-mono text-cyan-accent">
                      {event.queryId}
                    </td>
                    <td className="px-4 py-3">{event.check}</td>
                    <td className="px-4 py-3">{event.result}</td>
                    <td className="px-4 py-3">{event.reason}</td>
                    <td className="px-4 py-3">{event.action}</td>
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