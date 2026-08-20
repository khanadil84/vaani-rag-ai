import { BookX, Compass, ShieldCheck } from 'lucide-react'
import AnswerDecisionCard from '../components/AnswerDecisionCard'
import GroundingVerification from '../components/GroundingVerification'
import GuardrailEventLog from '../components/GuardrailEventLog'
import GuardrailExampleCard from '../components/GuardrailExampleCard'
import PageHeader from '../components/PageHeader'
import SafetyPolicy from '../components/SafetyPolicy'
import TrustCheckCard from '../components/TrustCheckCard'
import TrustPipeline from '../components/TrustPipeline'
import { TRUST_CHECKS } from '../lib/safety/config'

export default function TrustSafety() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={ShieldCheck}
        eyebrow="Trust & Safety"
        title="Trust & Safety"
        description="Every answer must be relevant, grounded, safe, and supported by retrieved context."
      />

      <section className="animate-rise [animation-delay:60ms]">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold tracking-tight text-white">
            Trust Engine
          </h2>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Decision checks applied before every answer is delivered.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_CHECKS.map((check) => (
            <TrustCheckCard key={check.id} check={check} className="animate-rise" />
          ))}
        </div>
      </section>

      <div className="grid animate-rise gap-6 lg:grid-cols-[minmax(0,1fr)_400px] [animation-delay:120ms]">
        <TrustPipeline />
        <AnswerDecisionCard className="lg:sticky lg:top-24 lg:self-start" />
      </div>

      <div className="grid animate-rise gap-6 lg:grid-cols-2 [animation-delay:180ms]">
        <GuardrailExampleCard
          tag="Example refusal state"
          tagAccent="saffron"
          title="Insufficient Context"
          message="I couldn't find enough information in the provided knowledge base to answer this question reliably."
          icon={BookX}
          actions={['View Retrieved Sources', 'Try Another Question']}
        />
        <GuardrailExampleCard
          tag="Example guardrail state"
          tagAccent="cyan"
          title="Outside Knowledge Scope"
          message="I can only answer questions supported by the provided knowledge base."
          icon={Compass}
          actions={['Try Another Question']}
        />
      </div>

      <div className="grid animate-rise gap-6 lg:grid-cols-2 [animation-delay:240ms]">
        <GroundingVerification />
        <SafetyPolicy />
      </div>

      <GuardrailEventLog className="animate-rise [animation-delay:300ms]" />
    </div>
  )
}