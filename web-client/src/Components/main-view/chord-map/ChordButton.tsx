import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { chordClicked } from '../../../state/chord-map/chord-map-saga-actions'
import { selectActiveChordIndex } from '../../../state/chord-map/chord-map-slice'
import { selectIsEditorOpen } from '../../../state/ui/ui-slice'
import type { ChordV1 } from '../../../types'
import PadButton from '../../common/buttons/PadButton'

function ChordButton({ chord, index }: { chord: ChordV1 | null; index: number }) {
  const dispatch = useDispatch()
  const editorOpen = useSelector(selectIsEditorOpen)
  const activeChordIndex = useSelector(selectActiveChordIndex)
  const onMouseDown = useCallback(
    (x, y) => dispatch(chordClicked({ index, x, y })),
    [dispatch, index],
  )

  return (
    <PadButton
      key={index}
      selected={editorOpen && activeChordIndex === index}
      empty={chord === null}
      text={chord?.name ?? ''}
      onMouseDown={onMouseDown}
    />
  )
}

export default React.memo(ChordButton)
