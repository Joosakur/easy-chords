import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import CircleActionButton from '../../common/buttons/CircleActionButton'
import { FixedSpacing } from '../../common/layout/flex'

const OctaveSpan = styled.span`
  font-weight: bold;
  white-space: nowrap;
`

interface OctaveSelectorProps {
  octave?: number
  min: number
  max: number
  onChange: (val: number) => void
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
