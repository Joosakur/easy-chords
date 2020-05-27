import React from 'react'
import styled from 'styled-components'
import {IntervalNumber} from '../../../types'
import PianoKey from './PianoKey'
import {BWWR} from '../../../constants'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-grow: 1;
  overflow-y: hidden;
`

const WhiteKeyPositioner = styled.div`
  height: 100%;
  flex-grow: 1;
  vertical-align: top;
`

const BlackKeyPositioner = styled.div<{adjustX: number}>`
  position: relative;
  top: -102%;
  left: ${p => 100 - BWWR / 2 + p.adjustX * 12}%;
  height: 66%;
  width: ${BWWR}%;
  border-top: none;
  border-bottom: rgba(26,27,28,0.91) 10px solid;
  border-left: rgba(32,34,35,0.62) 2px solid;
  border-right: #202223 2px solid;
  border-radius: 8px;
`

interface OctaveProps {
  octave: number
}

function Octave({ octave }: OctaveProps) {
  const whites: IntervalNumber[] = [0, 2, 4, 5, 7, 9, 11]
  const positionAdjust = [0, -1, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0]
  
  return (
    <Wrapper>
      { whites.map(interval => (
        <WhiteKeyPositioner key={interval}>
          <PianoKey note={12 * octave + interval}/>
          { interval !== 4 && interval !== 11 && (
            <BlackKeyPositioner
              key={interval+1}
              adjustX={positionAdjust[interval+1]}
            >
              <PianoKey note={12 * octave + interval + 1} />
            </BlackKeyPositioner>
          )}
        </WhiteKeyPositioner>
      ))}
    </Wrapper>
  )
}

export default Octave
