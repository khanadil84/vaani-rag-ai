import { ArrowUpRight, Plug, TerminalSquare } from 'lucide-react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import PageHeader from './PageHeader'

export interface ModuleFeature {
  icon: LucideIcon
  title: string
  description: string
}

export interface ModulePageProps {
  icon: LucideIcon
  title: string
  description: string
  eyebrow: string
  accent?: 'cyan' | 'violet' | 'saffron'
  apiEndpoints: string[]
  features: ModuleFeature[]
  children?: ReactNode
}

export default function ModulePage({
  icon,
  title,
  description,
  eyebrow,
  accent = 'cyan',
  apiEndpoints,
  features,
  children,
}: ModulePageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={icon}
        title={title}
        description={description}
        eyebrow={eyebrow}
        accent={accent}
      />

      <section className="animate-rise [animation-delay:80ms]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            What this module does
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-400">
            <Plug className="size-3 text-cyan-accent" aria-hidden="true" />
            API-ready
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const FeatureIcon = feature.icon
            return (
              <article
                key={feature.title}
                className="glass card-hover rounded-2xl p-5"
              >
                <div
                  className="inline-flex rounded-lg bg-cyan-accent/10 p-2 text-cyan-accent ring-1 ring-cyan-accent/20"
                  aria-hidden="true"
                >
                  <FeatureIcon className="size-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-[13px] leading-snug text-slate-400">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      {children}

      <section className="animate-rise [animation-delay:160ms]">
        <div className="mb-4 flex items-center gap-2">
          <TerminalSquare className="size-4 text-violet-soft" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            API contract
          </h2>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="mb-3 text-[13px] text-slate-400">
            This module is wired to the following endpoint
            {apiEndpoints.length > 1 ? 's' : ''}. Data is served live by the
            VaaniRAG backend.
          </p>
          <ul className="space-y-2">
            {apiEndpoints.map((endpoint) => (
              <li
                key={endpoint}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-night-950/60 px-3 py-2"
              >
                <code className="font-mono text-xs text-cyan-accent">
                  {endpoint}
                </code>
                <span className="text-[11px] text-slate-600">
                  {endpoint.split(' ')[0]}
                </span>
                <ArrowUpRight
                  className="ml-auto size-3.5 text-slate-600"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}