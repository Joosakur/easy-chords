import React, {useContext} from 'react'
import styled from 'styled-components'
import isEqual from 'lodash/isEqual'
import {Voicing} from '../../../types'
import {ChordMapContext} from '../../../state/chord-map-context'
import {SuperScript} from '../../common/typography'
import SelectionButton from '../../common/buttons/SelectionButton'

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
  activeVoicing?: Voicing
  onChange: (voicing: Voicing) => any
}
function QualityButton({mainText, superScript, voicing, activeVoicing, onChange}: QualityButtonProps) {
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
  const {chords, activeChordIndex} = useContext(ChordMapContext)
  const activeVoicing = (activeChordIndex !== null ? chords[activeChordIndex] : null)?.voicing
  
  return (
    <div>
      <ButtonGrid>
        <QualityButton voicing={[0, 7, 14, 24]} activeVoicing={activeVoicing} onChange={onChange} mainText='sus2'/>
        <QualityButton voicing={[0, 8, 16, 24]} activeVoicing={activeVoicing} onChange={onChange} mainText='aug'/>
        <QualityButton voicing={[0, 7, 17, 24]} activeVoicing={activeVoicing} onChange={onChange} mainText='sus4'/>
    
        <QualityButton voicing={[0, 7, 16, 22]} activeVoicing={activeVoicing} onChange={onChange} mainText='7'/>
        <QualityButton voicing={[0, 7, 16, 24]} activeVoicing={activeVoicing} onChange={onChange} mainText='major'/>
        <QualityButton voicing={[0, 7, 16, 23]} activeVoicing={activeVoicing} onChange={onChange} mainText='maj7'/>
    
        <QualityButton voicing={[0, 7, 15, 22]} activeVoicing={activeVoicing} onChange={onChange} mainText='m' superScript='7'/>
        <QualityButton voicing={[0, 7, 15, 24]} activeVoicing={activeVoicing} onChange={onChange} mainText='minor'/>
        <QualityButton voicing={[0, 7, 15, 23]} activeVoicing={activeVoicing} onChange={onChange} mainText='m' superScript='maj7'/>
    
        <QualityButton voicing={[0, 6, 15, 21]} activeVoicing={activeVoicing} onChange={onChange} mainText='dim' superScript='7'/>
        <QualityButton voicing={[0, 6, 15, 24]} activeVoicing={activeVoicing} onChange={onChange} mainText='dim'/>
        <QualityButton voicing={[0, 6, 15, 22]} activeVoicing={activeVoicing} onChange={onChange} mainText='m7' superScript='♭5'/>
      </ButtonGrid>
    </div>
  )
}

export default QualitySelector
