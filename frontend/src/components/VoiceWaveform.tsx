import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { cn } from '../lib/utils'

const BAR_COUNT = 36
const RING_RADIUS = 66
const BASE_HEIGHT = 11
const MAX_HEIGHT = 46

interface VoiceWaveformProps {
  active: boolean
  levelRef: MutableRefObject<number>
  className?: string
}

export default function VoiceWaveform({
  active,
  levelRef,
  className,
}: VoiceWaveformProps) {
  const barsRef = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    if (!active) return
    let frameId = 0
    const frame = () => {
      const level = levelRef.current
      barsRef.current.forEach((bar, index) => {
        if (!bar) return
        const wave = Math.sin(index * 0.7 + performance.now() / 240)
        const organic = 0.45 + 0.55 * (0.5 + 0.5 * wave)
        const height = BASE_HEIGHT + organic * level * MAX_HEIGHT
        bar.style.height = `${height.toFixed(1)}px`
        bar.style.transform = `rotate(${(360 / BAR_COUNT) * index}deg) translateY(-${RING_RADIUS}px)`
      })
      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(frameId)
  }, [active, levelRef])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      aria-hidden="true"
    >
      {Array.from({ length: BAR_COUNT }, (_, index) => {
        const angle = (360 / BAR_COUNT) * index
        const baseHeight = BASE_HEIGHT
        return (
          <span
            key={index}
            ref={(el) => {
              barsRef.current[index] = el
            }}
            className={cn(
              'absolute top-1/2 left-1/2 w-[3px] origin-center rounded-full',
              active
                ? 'bg-cyan-accent/70 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'animate-bar-twinkle bg-cyan-accent/40',
            )}
            style={{
              height: `${baseHeight}px`,
              marginLeft: '-1.5px',
              transform: `rotate(${angle}deg) translateY(-${RING_RADIUS}px)`,
            }}
          />
        )
      })}
    </div>
  )
}