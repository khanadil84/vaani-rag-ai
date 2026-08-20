import {
  AudioLines,
  BrainCog,
  Container,
  Languages,
  Mic,
  Settings,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import NeutralStatusBadge from '../components/NeutralStatusBadge'

interface ConfigRow {
  label: string
}

interface SettingsSectionConfig {
  title: string
  icon: LucideIcon
  rows: ConfigRow[]
}

const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  {
    title: 'Voice Provider',
    icon: Mic,
    rows: [{ label: 'Provider' }, { label: 'Accent' }],
  },
  {
    title: 'STT Provider',
    icon: AudioLines,
    rows: [{ label: 'Provider' }, { label: 'Model' }],
  },
  {
    title: 'Embedding Model',
    icon: BrainCog,
    rows: [{ label: 'Model' }, { label: 'Dimension' }],
  },
  {
    title: 'Vector Database',
    icon: Container,
    rows: [{ label: 'Engine' }, { label: 'Index Type' }],
  },
  {
    title: 'LLM',
    icon: Sparkles,
    rows: [{ label: 'Provider' }, { label: 'Model' }],
  },
  {
    title: 'Language',
    icon: Languages,
    rows: [{ label: 'Default' }, { label: 'Fallback' }],
  },
  {
    title: 'Latency Target',
    icon: Timer,
    rows: [{ label: 'Target' }],
  },
]

function ConfigCard({ section }: { section: SettingsSectionConfig }) {
  const Icon = section.icon
  return (
    <article className="glass card-hover rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl bg-cyan-accent/10 p-2.5 text-cyan-accent ring-1 ring-cyan-accent/20"
            aria-hidden="true"
          >
            <Icon className="size-5" />
          </div>
          <h2 className="font-display text-base font-semibold tracking-tight text-white">
            {section.title}
          </h2>
        </div>
        <NeutralStatusBadge label="Not set" />
      </div>
      <ul className="mt-4 space-y-2">
        {section.rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5"
          >
            <span className="text-[13px] text-slate-300">{row.label}</span>
            <code className="font-mono text-[13px] text-slate-500">--</code>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={Settings}
        eyebrow="Settings"
        title="Settings"
        description="API-ready configuration for the VaaniRAG AI system. Every value is applied when the backend is connected."
      />

      <div className="grid animate-rise gap-4 sm:grid-cols-2 lg:grid-cols-3 [animation-delay:60ms]">
        {SETTINGS_SECTIONS.map((section) => (
          <ConfigCard key={section.title} section={section} />
        ))}
      </div>

      <section className="glass animate-rise rounded-2xl p-5 [animation-delay:120ms]">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="rounded-xl bg-saffron-accent/10 p-2.5 text-saffron-accent ring-1 ring-saffron-accent/20"
            aria-hidden="true"
          >
            <ShieldCheck className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-semibold tracking-tight text-white">
              Configuration security
            </h2>
            <p className="mt-0.5 text-[13px] leading-relaxed text-slate-400">
              No values are stored, transmitted or displayed until the backend
              is connected. Secret values — such as provider API keys — are
              never exposed by the frontend.
            </p>
          </div>
          <NeutralStatusBadge label="Not connected" />
        </div>
      </section>
    </div>
  )
}