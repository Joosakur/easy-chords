import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { chordClicked } from '../../../state/chord-map/chord-map-saga-actions'
import { selectActiveChordIndex } from '../../../state/chord-map/chord-map-slice'
import { selectIsEditorOpen } from '../../../state/ui/ui-slice'
import type { ChordV1 } from '../../../types'
import PadButton from '../../common/buttons/PadButton'

interface ChordButtonProps {
  chord: ChordV1 | null
  index: number
  numCols: number
}

function ChordButton({ chord, index, numCols }: ChordButtonProps) {
  const dispatch = useDispatch()
  const editorOpen = useSelector(selectIsEditorOpen)
  const activeChordIndex = useSelector(selectActiveChordIndex)
  const onMouseDown = useCallback(
    (x, y) => dispatch(chordClicked({ index, x, y })),
    [dispatch, index],
  )

  const row = Math.floor(index / numCols)
  const col = index % numCols

  return (
    <PadButton
      key={index}
      selected={editorOpen && activeChordIndex === index}
      empty={chord === null}
      text={chord?.name ?? ''}
      onMouseDown={onMouseDown}
      data-test={`chord-slot-${row}-${col}`}
    />
  )
}

export default React.memo(ChordButton)
