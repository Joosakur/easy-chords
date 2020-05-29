import React, {useContext} from 'react'
import styled from 'styled-components'
import {ChordMapContext} from '../../state/chord-map-context'
import PadButton from '../common/buttons/PadButton'
import {PianoContext} from '../../state/piano-context'

const Wrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.4rem 0.8rem 0.8rem 0.4rem;
`

const ChordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 2em;
  row-gap: 2em;
  
  @media screen and (max-width: 1100px) {
    column-gap: 0.5em;
    row-gap: 1em;
  }
`

function ChordMap() {
  const {
    chords,
    activeChordIndex,
    setActiveChordIndex,
    editorOpen,
    editState,
    finishCopy,
    finishSwap
  } = useContext(ChordMapContext)
  const { playChord } = useContext(PianoContext)

  if(!chords) return null
  
  return (
    <Wrapper>
      <ChordGrid>
        { chords.map((chord, i) => (
          <PadButton
            key={i}
            selected={editorOpen && activeChordIndex === i}
            empty={chord === null}
            text={chord?.name ?? ''}
            onMouseDown={(x, y) => {
              if(editState === null) {
                setActiveChordIndex(i)
                if(chord) playChord(chord, x, y)
              } else if(editState.mode === 'copy'){
                finishCopy(i)
              } else if(editState.mode === 'swap'){
                finishSwap(i)
              }
            }}
          />
        ))}
      </ChordGrid>
    </Wrapper>
  )
}

export default ChordMap
