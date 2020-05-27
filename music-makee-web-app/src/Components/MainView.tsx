import React, {useContext} from 'react'
import styled from 'styled-components'
import ActionBar from './main-view/ActionBar'
import ChordMap from './main-view/ChordMap'
import {Colors, SPACING_LENGTHS} from './common/style-constants'
import {H1} from './common/typography'
import {darken, lighten, math, rem} from 'polished'
import bg from '../images/bg.png'
import Piano from './main-view/Piano'
import {PianoContext} from '../state/piano-context'
import ActionButton from './common/buttons/ActionButton'
import {ChordMapContext} from '../state/chord-map-context'
import {SettingsContext} from '../state/settings-context'
import {faCog, faMusic} from '@fortawesome/free-solid-svg-icons'
import {Gap} from './common/layout/whie-space'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  align-items: stretch;
  background-color: ${Colors.grey.dark};
  background: linear-gradient(${lighten(0.05, Colors.grey.dark)}, ${darken(0.05, Colors.grey.dark)});
  background-image: url(${bg});
  background-size: cover;
  background-position-y: 30px;
`

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5rem;
  background: linear-gradient(${Colors.primaryDark}, ${Colors.secondary});
  padding: 0 ${SPACING_LENGTHS.m};
`

const Padded = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 0 ${SPACING_LENGTHS.m};
`

interface ContentProps {
  editorOpen: boolean
}

const Content = styled.div<ContentProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 66%;
  flex-grow: 1;
  margin: 0 auto;
  padding: ${SPACING_LENGTHS.m};
  
  @media screen and (max-width: ${p => p.editorOpen ? math(`${rem('2200px')} + 33rem`) : '2200px'}) {
    max-width: 80%;
  }
  
  @media screen and (max-width: ${p => p.editorOpen ? math(`${rem('1600px')} + 33rem`) : '1600px'}) {
    width: unset;
    max-width: 100%;
    margin: 0;
    padding: ${SPACING_LENGTHS.m} 0;
  }
`

function MainView() {
  const { settingsOpen, setSettingsOpen } = useContext(SettingsContext)
  const { stopNotes } = useContext(PianoContext)
  const { editorOpen, setEditorOpen } = useContext(ChordMapContext)
  
  return (
    <Container onMouseUp={() => stopNotes()} >
      <TitleBar>
        { !editorOpen ? (
          <ActionButton
            text='Edit Chords'
            icon={faMusic}
            hideText='650px'
            onClick={() => setEditorOpen(!editorOpen)}
          />
        ) : (
          <div/>
        )}
    
        <H1 fitted>EasyChords</H1>
    
        <ActionButton
          text='Settings'
          icon={faCog}
          hideText='1200px'
          onClick={() => setSettingsOpen(!settingsOpen)}
        />
      </TitleBar>
  
      <Padded>
        <Content editorOpen={editorOpen}>
          <ActionBar/>
          <Gap />
          <div style={{flexGrow: 3}}/>
          <ChordMap/>
          <div style={{flexGrow: 4}}/>
        </Content>
      </Padded>
      
      <Piano/>
    </Container>
  )
}

export default MainView
