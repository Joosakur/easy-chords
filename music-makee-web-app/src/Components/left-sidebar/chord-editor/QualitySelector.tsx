import React from 'react'
import styled from 'styled-components'
import isEqual from 'lodash/isEqual'
import {Voicing} from '../../../types'
import {SuperScript} from '../../common/typography'
import SelectionButton from '../../common/buttons/SelectionButton'
import {selectActiveChord} from '../../../state/chord-map/chord-map-slice'
import {useSelector} from 'react-redux'

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
  onChange: (voicing: Voicing) => any
}
function QualityButton({mainText, superScript, voicing, onChange}: QualityButtonProps) {
  const activeVoicing = useSelector(selectActiveChord)?.voicing ?? []
  
  const matchesCurrent = activeVoicing && isEqual(
    new Set(voicing.filter(v => v !== null).map(v => v % 12)),
    new Set(activeVoicing.filter(v => v !== null).map(v => v % 12))
  )
  
  return (
    <SelectionButton
      onClick={() => onChange(voicing)}
      selected={matchesCurrent}
    >
      <div>
        <span>{mainText}</span>
        { superScript && <SuperScript>{superScript}</SuperScript>}
      </div>
    </SelectionButton>
  )
}

interface QualitySelectorProps {
  onChange: (voicing: Voicing) => any
}

function QualitySelector({onChange}: QualitySelectorProps) {
  return (
    <div>
      <ButtonGrid>
        <QualityButton voicing={[0, 7, 14, 24]} onChange={onChange} mainText='sus2'/>
        <QualityButton voicing={[0, 8, 16, 24]} onChange={onChange} mainText='aug'/>
        <QualityButton voicing={[0, 7, 17, 24]} onChange={onChange} mainText='sus4'/>
    
        <QualityButton voicing={[0, 7, 16, 22]} onChange={onChange} mainText='7'/>
        <QualityButton voicing={[0, 7, 16, 24]} onChange={onChange} mainText='major'/>
        <QualityButton voicing={[0, 7, 16, 23]} onChange={onChange} mainText='maj7'/>
    
        <QualityButton voicing={[0, 7, 15, 22]} onChange={onChange} mainText='m' superScript='7'/>
        <QualityButton voicing={[0, 7, 15, 24]} onChange={onChange} mainText='minor'/>
        <QualityButton voicing={[0, 7, 15, 23]} onChange={onChange} mainText='m' superScript='maj7'/>
    
        <QualityButton voicing={[0, 6, 15, 21]} onChange={onChange} mainText='dim' superScript='7'/>
        <QualityButton voicing={[0, 6, 15, 24]} onChange={onChange} mainText='dim'/>
        <QualityButton voicing={[0, 6, 15, 22]} onChange={onChange} mainText='m7' superScript='♭5'/>
      </ButtonGrid>
    </div>
  )
}

export default QualitySelector
