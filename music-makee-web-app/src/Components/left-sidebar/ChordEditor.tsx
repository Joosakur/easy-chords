import React, {useContext} from 'react'
import {ChordMapContext} from '../../state/chord-map-context'
import {ChordV1, IntervalNumber, Voicing} from '../../types'
import {getChordName} from '../../utils/music/chords'
import RootSelector from './chord-editor/RootSelector'
import QualitySelector from './chord-editor/QualitySelector'
import styled from 'styled-components'
import {Gap} from '../common/layout/whie-space'
import VoicingEditor from './chord-editor/VoicingEditor'
import OctaveSelector from './chord-editor/OctaveSelector'
import {Input} from 'semantic-ui-react'
import {CenteredDiv} from '../common/layout/flex'
import {SPACING_LENGTHS} from '../common/style-constants'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-grow: 1;
  align-items: stretch;
  margin-top: -1rem;
  padding: 0 ${SPACING_LENGTHS.m} ${SPACING_LENGTHS.s};
  
  >*:not(:last-child) {
    margin-bottom: ${SPACING_LENGTHS.m};
  }
`

const RootSelectorSlot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const NarrowInput = styled(Input)`
  width: 66%;
  input {
    width: inherit;
    text-align: center !important;
  }
`

function ChordEditor() {
  const { activeChordIndex, chords, playChord, updateChord } = useContext(ChordMapContext)
  
  const activeChord: ChordV1 = (activeChordIndex !== null && chords[activeChordIndex])
    || { root: 0, octave: 4, voicing: [], name: '' }
  
  const onRootChanged = (root: IntervalNumber) => {
    const newChord: ChordV1 = { ...activeChord, root }
    
    newChord.name = getChordName(newChord.root, newChord.voicing)
    
    playChord(newChord)
    if(activeChordIndex !== null) updateChord(activeChordIndex, newChord)
  }
  
  const onVoicingChanged = (voicing: Voicing) => {
    const newChord: ChordV1 = { ...activeChord, voicing }
    
    newChord.name = getChordName(newChord.root, newChord.voicing)
    
    if(activeChordIndex !== null) updateChord(activeChordIndex, newChord)
  }
  
  const onOctaveChanged = (octave: number) => {
    if(activeChord && activeChordIndex !== null){
      updateChord(activeChordIndex, { ...activeChord, octave })
    }
  }
  
  const onChordRenamed = (name: string) => {
    if(activeChord && activeChordIndex !== null) {
      updateChord(activeChordIndex, {...activeChord, name: name.substr(0, 10)})
    }
  }
  
  if(activeChordIndex === null) return (
    <Wrapper>
      <Gap size='s'/>
      <span className='text-medium'>Select chord to edit</span>
      <div style={{flexGrow: 1}}/>
    </Wrapper>
  )
  
  return (
    <Wrapper>
      <CenteredDiv>
        <RootSelector
          root={activeChord.root}
          onChange={onRootChanged}
        >
          <RootSelectorSlot>
            <NarrowInput
              value={activeChord.name}
              onChange={(e: any, data: { value: string }) => onChordRenamed(data.value)}/>
            <Gap size='s'/>
            <QualitySelector onChange={onVoicingChanged}/>
            <Gap size='s'/>
            <OctaveSelector octave={activeChord.octave} min={1} max={6} onChange={onOctaveChanged}/>
          </RootSelectorSlot>
        </RootSelector>
      </CenteredDiv>
      
      <div>
        <label className='text-high'>Chord Voicing</label>
        <Gap size='s'/>
        <VoicingEditor voicing={activeChord.voicing} onChange={onVoicingChanged}/>
      </div>
    </Wrapper>
  )
}

export default ChordEditor
