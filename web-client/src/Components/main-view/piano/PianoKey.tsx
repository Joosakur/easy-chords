import { useDroppable } from '@dnd-kit/core'
import classNames from 'classnames'
import { lighten } from 'polished'
import type React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { BWWR } from '../../../constants'
import { selectActiveChord } from '../../../state/chord-map/chord-map-slice'
import { pianoKeyClicked } from '../../../state/piano/piano-saga-actions'
import { selectIsKeyDown } from '../../../state/piano/piano-slice'
import { selectIsEditorOpen } from '../../../state/ui/ui-slice'
import { Colors } from '../../common/style-constants'
import RootButton from './RootButton'

interface KeyButtonProps {
  interval?: number
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`

const WhiteKeyButton = styled.button<KeyButtonProps>`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #e7efe8;
  border: 1px solid rgba(23, 23, 23, 0.89);
  outline: none;
  color: black;
  border-radius: 0 0 5px 5px;
  border-top: 6px #533724 solid;
  box-shadow: inset 1px 0 1px rgba(255, 255, 255, 0.59), inset 0 -3px 1px rgba(255, 255, 255, 0.89),
    inset 0 0 5px rgba(33, 32, 32, 0.45), inset 0 7px 7px -4px rgba(26, 26, 26, 0.75);

  ${(p) =>
    p.interval !== undefined
      ? `
    border-top: 4px solid ${Colors.interval[p.interval]};
    `
      : ''}

  &.active, &:hover, &.dropping, &.dropping.below-root {
    ${(p) =>
      p.interval !== undefined
        ? `
      border-top: 12px solid ${Colors.interval[p.interval]};
      background: linear-gradient(#e7efe8, #e7efe8 25%, ${Colors.interval[p.interval]});
      `
        : ''}
  }

  &.active:hover {
    ${(p) =>
      p.interval !== undefined
        ? `
      background: linear-gradient(#e7efe8, #e7efe8 10%, ${lighten(
        0.1,
        Colors.interval[p.interval],
      )});
      `
        : ''}
  }

  &:active,
  &.pressed {
    box-shadow: inset 0 7px 7px -4px rgba(26, 26, 26, 0.75), inset 0 -3px 3px #363433;

    background: linear-gradient(80deg, rgb(154, 149, 145) 0%, #e7efe8 55%);
  }

  &.dragging,
  &.below-root {
    background: #e7efe8;
  }
`

const BlackKeyButton = styled.button<KeyButtonProps>`
  position: relative;
  width: 100%;
  height: 103%;
  margin: 0;
  padding: 0;
  outline: none;
  border-radius: 5px 5px 15px 15px;
  border: none;

  background: linear-gradient(
    #181818 0%,
    #1f1e1e 80%,
    #5b5e63 83%,
    #9ca0a7 84%,
    #35383d 85%,
    #5b5e63 93%,
    #0f0f10
  );
  box-shadow: inset 1px 2px 2px 2px rgba(188, 198, 201, 0.7), 3px 5px 20px 2px #262525;

  ${(p) =>
    p.interval !== undefined
      ? `
    border-top: 4px solid ${Colors.interval[p.interval]};
    `
      : ''}

  &.active, &:hover, &.dropping, &.dropping.below-root {
    ${(p) =>
      p.interval !== undefined
        ? `
      border-top: 12px solid ${Colors.interval[p.interval]};
      background: linear-gradient(#181818, #181818 20%, ${Colors.interval[p.interval]});
      `
        : ''}
  }

  &.active:hover {
    filter: brightness(1.33);
  }

  &:active,
  &.pressed {
    background: linear-gradient(
      #232121 0%,
      #8d8c8c 87%,
      #5b5e63 90%,
      #93969c 91%,
      #3b3d40 93%,
      #222426 95%,
      #0f0f10
    );
    box-shadow: inset 1px 2px 2px 2px rgba(188, 198, 201, 0.7),
      0 5px 20px 2px rgba(38, 37, 37, 0.62);
  }

  &.dragging,
  &.below-root {
    background: linear-gradient(
      #181818 0%,
      #1f1e1e 80%,
      #5b5e63 83%,
      #9ca0a7 84%,
      #35383d 85%,
      #5b5e63 93%,
      #0f0f10
    );
  }
`

const RootPositioner = styled.div`
  position: relative;
  top: -100%;
  width: ${BWWR}%;
  margin: auto;

  &.black {
    width: 100%;
  }

  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

interface PianoKeyProps {
  note: number
}

function PianoKey({ note }: PianoKeyProps) {
  const dispatch = useDispatch()
  const editorOpen = useSelector(selectIsEditorOpen)
  const pressed = useSelector(selectIsKeyDown(note))
  const activeChord = useSelector(selectActiveChord)

  const { isOver, setNodeRef, active } = useDroppable({
    id: `piano-key-${note}`,
    data: { note },
  })

  const isDragging = active?.id === 'root'

  // Interval from root (0-11) determines the color band shown on the key
  const interval = editorOpen && activeChord ? (note - activeChord.root) % 12 : undefined

  // Visual states for CSS classes
  const state = {
    pressed, // Currently sounding (in keysDown)
    active: // Part of the active chord's voicing
      editorOpen &&
      activeChord?.voicing?.includes(
        note - (activeChord?.root ?? 0) - 12 * (activeChord?.octave ?? 0),
      ),
    dragging: editorOpen && isDragging && !isOver, // Root is being dragged, not over this key
    dropping: editorOpen && isDragging && isOver, // Root is being dragged over this key
    'below-root': activeChord && note < 12 * activeChord.octave + activeChord.root, // Dimmed
  }

  const onKeyPress = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(pianoKeyClicked(note))
  }

  const black = [1, 3, 6, 8, 10].includes(note % 12)

  return (
    <Wrapper>
      {black ? (
        <BlackKeyButton
          ref={setNodeRef}
          className={classNames(state)}
          onMouseDown={onKeyPress}
          interval={interval}
        />
      ) : (
        <WhiteKeyButton
          ref={setNodeRef}
          className={classNames(state)}
          onMouseDown={onKeyPress}
          interval={interval}
        />
      )}
      {editorOpen && activeChord && note === 12 * activeChord.octave + activeChord.root && (
        <RootPositioner className={classNames({ black })}>
          <RootButton />
        </RootPositioner>
      )}
    </Wrapper>
  )
}

export default PianoKey
