import React from 'react'
import styled from 'styled-components'
import { selectChords } from '../../state/chord-map/chord-map-slice'
import { useSelector } from 'react-redux'
import ChordButton from './chord-map/ChordButton'

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
  const chords = useSelector(selectChords)

  return (
    <Wrapper
      onDragStart={e => e.preventDefault()}>
      <ChordGrid>
        {chords.map((chord, index) => (
          <ChordButton key={index} chord={chord} index={index} />
        ))}
      </ChordGrid>
    </Wrapper>
  )
}

export default ChordMap
