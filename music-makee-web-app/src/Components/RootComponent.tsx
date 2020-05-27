import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import {SettingsContext} from '../state/settings-context'
import MainView from './MainView'
import {cover} from 'polished'
import {ChordMapContext} from '../state/chord-map-context'
import {PianoContext} from '../state/piano-context'

const RootContainer = styled.div`
  display: flex;
  ${cover()}
`

function RootComponent() {
  const { settingsOpen, setSettingsOpen } = useContext(SettingsContext)
  const { editorOpen, activeChord, playChord, stopChord } = useContext(ChordMapContext)
  const { setSustainPedal } = useContext(PianoContext)
  
  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if(document.activeElement && ['input'].includes(document.activeElement.tagName.toLowerCase())) return
      
      if(event.code === 'Space'){
        event.preventDefault()
      }
      
      if(event.repeat) return
      
      if(event.code === 'Space'){
        if(editorOpen){
          if(activeChord) playChord(activeChord)
        } else {
          setSustainPedal(true)
        }
      }
    }
  
    const keyUpListener = (event: KeyboardEvent) => {
      if(document.activeElement && ['input'].includes(document.activeElement.tagName.toLowerCase())) return
      
      if(event.code === 'Space'){
        if(editorOpen){
          stopChord()
        } else {
          setSustainPedal(false)
        }
      }
    }
    
    window.addEventListener('keydown', keyDownListener)
    window.addEventListener('keyup', keyUpListener)
  
    return () => {
      window.removeEventListener('keydown', keyDownListener)
      window.removeEventListener('keyup', keyUpListener)
    }
  }, [activeChord, playChord, editorOpen, setSustainPedal, stopChord])
  
  
  return (
    <RootContainer>
      <LeftSidebar/>
      <MainView/>
      <RightSidebar open={settingsOpen} toggle={() => setSettingsOpen(!setSettingsOpen)}/>
    </RootContainer>
  )
}

export default RootComponent
