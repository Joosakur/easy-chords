import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import type { PadPosition } from '../../../state/cc-pad/cc-pad-saga-actions'
import { Colors } from '../../common/style-constants'

const Surface = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.7));
  box-shadow: inset 0 0 3rem rgba(0, 0, 0, 0.6);
  cursor: crosshair;
  overflow: hidden;

  /* Without this a touch drag scrolls the page instead of moving the pad */
  touch-action: none;
`

const Guide = styled.div<{ $vertical?: boolean }>`
  position: absolute;
  background: ${Colors.states.active};
  opacity: 0.5;
  ${(p) => (p.$vertical ? 'top: 0; bottom: 0; width: 1px;' : 'left: 0; right: 0; height: 1px;')}
`

const Marker = styled.div`
  position: absolute;
  height: 1.1rem;
  width: 1.1rem;
  margin: 0 0 -0.55rem -0.55rem;
  border-radius: 100%;
  background: ${Colors.states.active};
  box-shadow: 0 0 0.8rem ${Colors.states.active};
`

interface PadSurfaceProps {
  widthPercent: number
  heightPercent: number
  xEnabled: boolean
  yEnabled: boolean
  onMove: (position: PadPosition) => void
  children?: React.ReactNode
}

const clampRatio = (value: number) => Math.min(1, Math.max(0, value))

function PadSurface({
  widthPercent,
  heightPercent,
  xEnabled,
  yEnabled,
  onMove,
  children,
}: PadSurfaceProps) {
  const [position, setPosition] = useState<PadPosition | null>(null)
  const pressed = useRef(false)

  const emit = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
      if (width <= 0 || height <= 0) return

      const next: PadPosition = {
        xRatio: clampRatio((event.clientX - left) / width),
        yRatio: 1 - clampRatio((event.clientY - top) / height),
      }
      setPosition(next)
      onMove(next)
    },
    [onMove],
  )

  return (
    <Surface
      style={{ width: `${widthPercent}%`, height: `${heightPercent}%` }}
      data-test="cc-pad-surface"
      onPointerDown={(e) => {
        // Capture keeps the drag tracking once the pointer leaves the pad, so the extremes of the
        // range stay reachable without having to stop exactly at the edge.
        e.currentTarget.setPointerCapture(e.pointerId)
        pressed.current = true
        emit(e)
      }}
      onPointerMove={(e) => {
        if (pressed.current) emit(e)
      }}
      onPointerUp={(e) => {
        pressed.current = false
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
      onPointerCancel={() => {
        pressed.current = false
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}

      {position && (
        <>
          {xEnabled && <Guide $vertical style={{ left: `${position.xRatio * 100}%` }} />}
          {yEnabled && <Guide style={{ bottom: `${position.yRatio * 100}%` }} />}
          <Marker
            style={{
              left: `${position.xRatio * 100}%`,
              bottom: `${position.yRatio * 100}%`,
            }}
          />
        </>
      )}
    </Surface>
  )
}

export default PadSurface
