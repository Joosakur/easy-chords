import React, { useEffect } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { useDrag, DragSourceMonitor, useDragLayer } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { cloneDeep } from 'lodash'
import { darken } from 'polished'
import { IntervalNumber } from '../../../types'
import { getChordName } from '../../../utils/music/chords'
import { Colors } from '../../common/style-constants'
import { selectActiveChord, setChord } from '../../../state/chord-map/chord-map-slice'
import { useDispatch, useSelector } from 'react-redux'

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

const RootGhost = styled(Root)`
  width: 2rem;
  height: 2rem;
  background: ${Colors.interval[0]};
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.65), inset 1px 1px 2px rgba(255, 255, 255, 0.3),
    inset -1px -1px 2px rgba(0, 0, 0, 0.34);
`

const DragLayer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

export function RootDragLayerHorizontal() {
  const { itemType, isDragging, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  if (!(isDragging && itemType === 'root' && initialOffset && currentOffset)) return null

  return (
    <DragLayer>
      <RootGhost style={{ transform: `translate(${currentOffset.x}px, ${initialOffset.y}px)` }}>
        R
      </RootGhost>
    </DragLayer>
  )
}

function RootButton() {
  const dispatch = useDispatch()
  const activeChord = useSelector(selectActiveChord)

  const updateRoot = (note: number) => {
    if (!activeChord) return
    const octave = Math.floor(note / 12)
    const root = (note % 12) as IntervalNumber
    const newChord = {
      ...cloneDeep(activeChord),
      octave,
      root,
      name: getChordName(root, activeChord.voicing)
    }
    dispatch(setChord({ chord: newChord }))
  }

  const [{ isDragging }, drag, preview] = useDrag({
    item: { name: 'root', type: 'root' },
    end: (item: any | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        updateRoot(dropResult.note)
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  const className = classNames({
    dragging: isDragging,
    'adjust-left': activeChord && [0, 5].includes(activeChord.root),
    'adjust-right': activeChord && [4, 11].includes(activeChord.root)
  })

  return (
    <Root ref={drag} className={className}>
      R
    </Root>
  )
}

export default RootButton
