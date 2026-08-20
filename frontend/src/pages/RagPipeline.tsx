import { Plug, Workflow } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import RagPipelineVisualizer from '../components/RagPipelineVisualizer'

const ENDPOINTS = ['POST /api/query', 'GET /api/metrics', 'GET /api/health']

export default function RagPipeline() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={Workflow}
        eyebrow="RAG Pipeline"
        title="RAG Pipeline"
        description="End-to-end retrieval-augmented generation — from voice input to a grounded answer, stage by stage."
      />

      <RagPipelineVisualizer className="animate-rise [animation-delay:80ms]" />

      <section className="glass animate-rise [animation-delay:160ms] rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <Plug className="size-4 text-violet-soft" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            API contract
          </h2>
        </div>
        <p className="mb-3 max-w-2xl text-[13px] leading-relaxed text-slate-400">
          Queries run through the backend via the endpoints below. The pipeline
          is connected; unmeasured stages are reported as not measured until a
          retrieval corpus and generation model are configured.
        </p>
        <ul className="flex flex-wrap gap-2">
          {ENDPOINTS.map((endpoint) => (
            <li
              key={endpoint}
              className="rounded-xl border border-white/10 bg-night-950/60 px-3 py-2"
            >
              <code className="font-mono text-xs text-cyan-accent">
                {endpoint}
              </code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}