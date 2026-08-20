import { Activity, Gauge } from 'lucide-react'
import { LATENCY_STAGES, LATENCY_TARGET_MS } from '../lib/latency/stages'
import type { LatencyMeasurement } from '../lib/latency/types'
import { cn } from '../lib/utils'
import LatencyEmptyState from './LatencyEmptyState'

const CHART_WIDTH = 600
const CHART_HEIGHT = 240
const CHART_PAD = 30

const QUERY_GRADIENT = 'query-latency-grad'
const STAGE_GRADIENT = 'stage-latency-grad'

function QueryLatencyChart({ data }: { data: LatencyMeasurement[] }) {
  const maxLatency = Math.max(
    LATENCY_TARGET_MS,
    ...data.map((measurement) => measurement.totalLatencyMs),
  )
  const innerWidth = CHART_WIDTH - CHART_PAD * 2
  const innerHeight = CHART_HEIGHT - CHART_PAD * 2
  const yFor = (value: number) =>
    CHART_HEIGHT - CHART_PAD - (value / maxLatency) * innerHeight
  const xFor = (index: number) =>
    CHART_PAD + (index / Math.max(1, data.length - 1)) * innerWidth
  const points = data
    .map(
      (measurement, index) =>
        `${xFor(index)},${yFor(measurement.totalLatencyMs)}`,
    )
    .join(' ')
  const targetY = yFor(LATENCY_TARGET_MS)

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="w-full"
      role="img"
      aria-label={`${data.length} latency measurements across queries`}
    >
      <line
        x1={CHART_PAD}
        x2={CHART_WIDTH - CHART_PAD}
        y1={targetY}
        y2={targetY}
        stroke="rgba(245,158,11,0.55)"
        strokeWidth="1"
        strokeDasharray="5 4"
      />
      <text
        x={CHART_WIDTH - CHART_PAD}
        y={targetY - 6}
        textAnchor="end"
        fill="rgba(245,158,11,0.85)"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
      >
        target {LATENCY_TARGET_MS} ms
      </text>

      <polyline
        points={points}
        fill="none"
        stroke={`url(#${QUERY_GRADIENT})`}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((measurement, index) => (
        <circle
          key={measurement.queryId}
          cx={xFor(index)}
          cy={yFor(measurement.totalLatencyMs)}
          r="3"
          fill="#22d3ee"
          stroke="#060b18"
          strokeWidth="1.5"
        />
      ))}

      <defs>
        <linearGradient id={QUERY_GRADIENT} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function StageLatencyChart({ data }: { data: LatencyMeasurement[] }) {
  const latest = data[data.length - 1]
  const stageMap = new Map(latest.stages.map((stage) => [stage.stage, stage.latencyMs]))
  const maxLatency = Math.max(
    LATENCY_TARGET_MS,
    ...latest.stages.map((stage) => stage.latencyMs),
  )
  const innerWidth = CHART_WIDTH - CHART_PAD * 2
  const innerHeight = CHART_HEIGHT - CHART_PAD * 2
  const slot = innerWidth / LATENCY_STAGES.length
  const barWidth = Math.min(30, slot * 0.5)
  const yFor = (value: number) =>
    CHART_HEIGHT - CHART_PAD - (value / maxLatency) * innerHeight

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="w-full"
      role="img"
      aria-label="Latency by pipeline stage"
    >
      {LATENCY_STAGES.map((stage, index) => {
        const latency = stageMap.get(stage.id)
        const centerX = CHART_PAD + slot * index + slot / 2
        const barTop = latency !== undefined ? yFor(latency) : CHART_HEIGHT - CHART_PAD
        const barHeight = latency !== undefined ? CHART_HEIGHT - CHART_PAD - barTop : 0
        return (
          <g key={stage.id}>
            <rect
              x={centerX - barWidth / 2}
              y={barTop}
              width={barWidth}
              height={barHeight}
              rx="4"
              fill={
                latency !== undefined
                  ? `url(#${STAGE_GRADIENT})`
                  : 'rgba(148,163,184,0.14)'
              }
            />
            <text
              x={centerX}
              y={CHART_HEIGHT - CHART_PAD + 14}
              textAnchor="middle"
              fill="rgba(148,163,184,0.7)"
              fontSize="8"
              fontFamily="ui-monospace, monospace"
            >
              {stage.short}
            </text>
          </g>
        )
      })}

      <defs>
        <linearGradient id={STAGE_GRADIENT} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

interface LatencyChartProps {
  title: string
  description: string
  data: LatencyMeasurement[]
  variant: 'queries' | 'stages'
  className?: string
}

export default function LatencyChart({
  title,
  description,
  data,
  variant,
  className,
}: LatencyChartProps) {
  const hasData = data.length > 0

  return (
    <section className={cn('glass card-hover rounded-2xl p-5 sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-0.5 text-[13px] text-slate-400">{description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-slate-400">
          {hasData ? `${data.length} measurements` : '-- measurements'}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-night-950/50">
        {hasData ? (
          variant === 'queries' ? (
            <QueryLatencyChart data={data} />
          ) : (
            <StageLatencyChart data={data} />
          )
        ) : (
          <LatencyEmptyState
            icon={variant === 'queries' ? Activity : Gauge}
            title="No latency measurements yet"
            description="Real query latency will render here once the benchmark backend is connected."
          />
        )}
      </div>
    </section>
  )
}