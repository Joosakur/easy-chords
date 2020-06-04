import React from 'react'
import styled from 'styled-components'
import { FixedSpacing } from '../../common/layout/flex'
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import CircleActionButton from '../../common/buttons/CircleActionButton'

const OctaveSpan = styled.span`
  font-weight: bold;
  white-space: nowrap;
`

interface OctaveSelectorProps {
  octave?: number
  min: number
  max: number
  onChange: (val: number) => any
}

function OctaveSelector({ octave, min, max, onChange }: OctaveSelectorProps) {
  return (
    <FixedSpacing spacing="s">
      <CircleActionButton
        icon={faCaretLeft}
        altText="Octave down"
        onClick={() => octave !== undefined && onChange(octave - 1)}
        disabled={octave === undefined || octave <= min}
      />

      <OctaveSpan className="text-high">Octave: {octave ?? '-'}</OctaveSpan>

      <CircleActionButton
        icon={faCaretRight}
        altText="Octave up"
        onClick={() => octave !== undefined && onChange(octave + 1)}
        disabled={octave === undefined || octave >= max}
      />
    </FixedSpacing>
  )
}

export default OctaveSelector
