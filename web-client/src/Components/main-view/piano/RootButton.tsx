/**
 * Draggable root indicator that appears on piano keys.
 *
 * Dragging to a new key changes the chord's root and octave, which effectively
 * transposes the chord (since voicing intervals are relative to root).
 *
 * Note: This behavior can be confusing - see docs/future-ideas.md for planned
 * UX improvement to separate "change root interpretation" from "transpose".
 */

import { DragOverlay, useDndMonitor, useDraggable } from '@dnd-kit/core'
import classNames from 'classnames'
import { darken } from 'polished'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectActiveChord, setChord } from '../../../state/chord-map/chord-map-slice'
import type { IntervalNumber } from '../../../types'
import { getChordName } from '../../../utils/music/chords'
import { Colors } from '../../common/style-constants'

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${Colors.grey.darker};
  text-align: center;
  font-weight: 600;

  background: ${darken(0.15, Colors.interval[0])};
  border-radius: 100%;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.65), inset 1px 1px 2px rgba(255, 255, 255, 0.3),
    inset -1px -1px 2px rgba(0, 0, 0, 0.34);

  touch-action: none;
  cursor: grab;

  &.dragging {
    opacity: 0;
  }
  &.adjust-left {
    left: -33%;
  }
  &.adjust-right {
    left: 33%;
  }
`

const RootGhost = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Colors.grey.darker};
  font-weight: 600;
  background: ${Colors.interval[0]};
  border-radius: 100%;
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.65), inset 1px 1px 2px rgba(255, 255, 255, 0.3),
    inset -1px -1px 2px rgba(0, 0, 0, 0.34);
`

export function RootDragLayerHorizontal() {
  const [isDragging, setIsDragging] = useState(false)

  useDndMonitor({
    onDragStart(event) {
      if (event.active.id === 'root') {
        setIsDragging(true)
      }
    },
    onDragEnd() {
      setIsDragging(false)
    },
    onDragCancel() {
      setIsDragging(false)
    },
  })

  return (
    <DragOverlay dropAnimation={null}>{isDragging ? <RootGhost>R</RootGhost> : null}</DragOverlay>
  )
}

function RootButton() {
  const dispatch = useDispatch()
  const activeChord = useSelector(selectActiveChord)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'root',
  })

  useDndMonitor({
    onDragEnd(event) {
      if (event.active.id === 'root' && event.over) {
        const note = event.over.data.current?.note as number | undefined
        if (note !== undefined && activeChord) {
          const octave = Math.floor(note / 12)
          const root = (note % 12) as IntervalNumber
          const newChord = {
            ...structuredClone(activeChord),
            octave,
            root,
            name: getChordName(root, activeChord.voicing),
          }
          dispatch(setChord({ chord: newChord }))
        }
      }
    },
  })

  // Adjust position on keys adjacent to black keys so the indicator doesn't overlap
  const className = classNames({
    dragging: isDragging,
    'adjust-left': activeChord && [0, 5].includes(activeChord.root), // C, F
    'adjust-right': activeChord && [4, 11].includes(activeChord.root), // E, B
  })

  return (
    <Root ref={setNodeRef} className={className} {...listeners} {...attributes}>
      R
    </Root>
  )
}

export default RootButton
