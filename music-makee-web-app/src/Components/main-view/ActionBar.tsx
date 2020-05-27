import React, {useContext, useMemo, useRef, useState} from 'react'
import styled from 'styled-components'
import {DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu} from 'semantic-ui-react'
import {faCopy, faExchangeAlt, faFileExport, faFileImport, faMusic, faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import {ChordMapDefinitionV1} from '../../types'
import {ChordMapContext} from '../../state/chord-map-context'
import {FixedSpacing} from '../common/layout/flex'
import ActionButton from '../common/buttons/ActionButton'
import Dropdown from '../common/Dropdown'
import api from '../../api/http-client'
import {FadedColors, SPACING_LENGTHS} from '../common/style-constants'

const ActionBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  >*:first-child {
    margin-right: ${SPACING_LENGTHS.m};
  }
  
  
  @media screen and (max-width: 650px) {
    .presets {
      flex-grow: 1;
    }
    .ui.dropdown {
      flex-grow: 1;
    }
  }
  
`

function ActionBar() {
  const {
    chords, setChords,
    activeChord, activeChordIndex, setActiveChordIndex,
    editorOpen,
    editState, setEditState, clear
  } = useContext(ChordMapContext)
  
  const loadChordMap = (path: string) => {
    api.getChordMapPreset(path).then(chordMap => {
      setActiveChordIndex(null)
      setChords(chordMap.chords)
    })
  }
  
  const exportHref = useMemo(() => {
    const chordMap: ChordMapDefinitionV1 = { chords, version: 1 }
    return window.URL.createObjectURL(
      new Blob([JSON.stringify(chordMap)], {type: 'application/json'})
    )
  }, [chords])
  
  const fileSelector = useRef<HTMLInputElement>(null)
  const exportLink = useRef<HTMLAnchorElement>(null)
  
  return (
    <ActionBarContainer>
      <FixedSpacing style={{justifyContent: 'flex-start'}}>
        { editorOpen && activeChordIndex !== null && activeChord !== null && !editState && (<>
          <ActionButton
            icon={faCopy}
            text='Copy'
            hideText='1600px'
            color={FadedColors.secondary}
            onClick={() => {setEditState({ mode: 'copy', target: activeChordIndex })}}
          />
          <ActionButton
            icon={faExchangeAlt}
            text='Swap'
            hideText='1600px'
            color={FadedColors.secondary}
            onClick={() => {setEditState({ mode: 'swap', target: activeChordIndex })}}
          />
          <ActionButton
            icon={faTrashAlt}
            text='Clear chord'
            hideText='1600px'
            color={FadedColors.secondary}
            onClick={() => clear()}
          />
        </>) }
        
        { editorOpen && activeChordIndex !== null && editState && (
          <FixedSpacing>
            { editState.mode === 'copy' && <span className='text-high'>Copy to...</span>}
            { editState.mode === 'swap' && <span className='text-high'>Swap with...</span>}
            <ActionButton
              text='Cancel'
              onClick={() => {setEditState(null)}}
            />
          </FixedSpacing>
        )}
      </FixedSpacing>
      
      <FixedSpacing className='presets'>
        <Dropdown placeholder='Load preset'>
          <DropdownMenu>
            <DropdownHeader>Basic and substitute chords</DropdownHeader>
            <DropdownItem onClick={() => loadChordMap('/disub/C')}>C / Am</DropdownItem>
            <DropdownItem disabled>G / Em</DropdownItem>
            <DropdownDivider/>
            <DropdownHeader>Songs</DropdownHeader>
            <DropdownItem onClick={() => loadChordMap('/songs/Smile')} text='Smile' description='Charlie Chaplin'/>
          </DropdownMenu>
        </Dropdown>
  
        <a style={{display: 'none'}} ref={exportLink} href={exportHref} download='My Chords.json'>Export</a>
        <ActionButton
          text='Export'
          icon={faFileExport}
          onClick={() => exportLink.current?.click()}
          hideText='1200px'
          color={FadedColors.secondary}
        />
  
        <input style={{display: 'none'}} ref={fileSelector} type='file' accept='application/json'
               onChange={() => {
                 if(fileSelector.current) {
                   setActiveChordIndex(null)
                   readFile(fileSelector.current, (chordMap) => setChords(chordMap.chords))
                 }
               }}
        />
        <ActionButton
          text='Import'
          icon={faFileImport}
          onClick={() => fileSelector.current?.click()}
          hideText='1200px'
          color={FadedColors.secondary}
        />
      </FixedSpacing>
    </ActionBarContainer>
  )
}

function readFile(input: HTMLInputElement, onSuccess: (chordMap: ChordMapDefinitionV1) => void) {
  const file = input.files?.item(0)
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const contents = event.target?.result;
    if(!contents){
      console.error('No contents')
    } else {
      let chordMap: any
      try {
        chordMap = JSON.parse(contents.toString())
      } catch (e) {
        console.error(e)
        return
      }
      
      if(chordMap.version === 1) {
        const v1: ChordMapDefinitionV1 = { ...chordMap }
        onSuccess(v1)
      } else {
        throw new Error(`Version of chord map definition not supported: ${chordMap.version}`)
      }
    }
  }
  
  reader.onerror = function(event) {
    console.error(`File could not be read! Code ${event.target?.error?.code}`)
  }
  
  if(!file) {
    console.warn('No file selected')
  } else {
    reader.readAsText(file)
  }
}

export default ActionBar
