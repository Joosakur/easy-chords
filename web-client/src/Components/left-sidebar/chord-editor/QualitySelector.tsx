import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectActiveChord } from '../../../state/chord-map/chord-map-slice'
import type { Voicing } from '../../../types'
import SelectionButton from '../../common/buttons/SelectionButton'
import { SuperScript } from '../../common/typography'

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 0.6em;
  grid-column-gap: 0.4em;
  width: 100%;
  margin: 0.5em auto;
  font-size: 0.66rem;
`

interface QualityButtonProps {
  mainText: string
  superScript?: string
  voicing: Voicing
  onChange: (voicing: Voicing) => void
  'data-test': string
}
function QualityButton({
  mainText,
  superScript,
  voicing,
  onChange,
  'data-test': dataTest,
}: QualityButtonProps) {
  const activeVoicing = useSelector(selectActiveChord)?.voicing ?? []

  const voicingSet = new Set(voicing.filter((v) => v !== null).map((v) => v % 12))
  const activeSet = new Set(activeVoicing.filter((v) => v !== null).map((v) => v % 12))
  const matchesCurrent =
    activeVoicing &&
    voicingSet.size === activeSet.size &&
    [...voicingSet].every((v) => activeSet.has(v))

  return (
    <SelectionButton
      onClick={() => onChange(voicing)}
      selected={matchesCurrent}
      data-test={dataTest}
    >
      <div>
        <span>{mainText}</span>
        {superScript && <SuperScript>{superScript}</SuperScript>}
      </div>
    </SelectionButton>
  )
}

interface QualitySelectorProps {
  onChange: (voicing: Voicing) => void
}

function QualitySelector({ onChange }: QualitySelectorProps) {
  return (
    <div>
      <ButtonGrid>
        <QualityButton
          voicing={[0, 7, 14, 24]}
          onChange={onChange}
          mainText="sus2"
          data-test="quality-sus2"
        />
        <QualityButton
          voicing={[0, 8, 16, 24]}
          onChange={onChange}
          mainText="aug"
          data-test="quality-aug"
        />
        <QualityButton
          voicing={[0, 7, 17, 24]}
          onChange={onChange}
          mainText="sus4"
          data-test="quality-sus4"
        />

        <QualityButton
          voicing={[0, 7, 16, 22]}
          onChange={onChange}
          mainText="7"
          data-test="quality-7"
        />
        <QualityButton
          voicing={[0, 7, 16, 24]}
          onChange={onChange}
          mainText="major"
          data-test="quality-major"
        />
        <QualityButton
          voicing={[0, 7, 16, 23]}
          onChange={onChange}
          mainText="maj7"
          data-test="quality-maj7"
        />

        <QualityButton
          voicing={[0, 7, 15, 22]}
          onChange={onChange}
          mainText="m"
          superScript="7"
          data-test="quality-m7"
        />
        <QualityButton
          voicing={[0, 7, 15, 24]}
          onChange={onChange}
          mainText="minor"
          data-test="quality-minor"
        />
        <QualityButton
          voicing={[0, 7, 15, 23]}
          onChange={onChange}
          mainText="m"
          superScript="maj7"
          data-test="quality-mmaj7"
        />

        <QualityButton
          voicing={[0, 6, 15, 21]}
          onChange={onChange}
          mainText="dim"
          superScript="7"
          data-test="quality-dim7"
        />
        <QualityButton
          voicing={[0, 6, 15, 24]}
          onChange={onChange}
          mainText="dim"
          data-test="quality-dim"
        />
        <QualityButton
          voicing={[0, 6, 15, 22]}
          onChange={onChange}
          mainText="m7"
          superScript="♭5"
          data-test="quality-m7b5"
        />
      </ButtonGrid>
    </div>
  )
}

export default QualitySelector
