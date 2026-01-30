import {
  faCopy,
  faExchangeAlt,
  faFileExport,
  faFileImport,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { importChordMap, loadChordMap } from '../../state/actions'
import {
  clearChord,
  selectChords,
  selectEditMode,
  selectIsChordButtonSelected,
  setEditMode,
} from '../../state/chord-map/chord-map-slice'
import { selectIsEditorOpen } from '../../state/ui/ui-slice'
import type { ChordMapDefinitionV1 } from '../../types'
import ActionButton from '../common/buttons/ActionButton'
import Dropdown, {
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
} from '../common/Dropdown'
import { FixedSpacing } from '../common/layout/flex'
import { FadedColors, SPACING_LENGTHS } from '../common/style-constants'

const ActionBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  > *:first-child {
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
  const dispatch = useDispatch()
  const chords = useSelector(selectChords)
  const editorOpen = useSelector(selectIsEditorOpen)
  const chordButtonSelected = useSelector(selectIsChordButtonSelected)
  const editMode = useSelector(selectEditMode)

  const exportHref = useMemo(() => {
    const chordMap: ChordMapDefinitionV1 = { chords, version: 1 }
    return window.URL.createObjectURL(
      new Blob([JSON.stringify(chordMap)], { type: 'application/json' }),
    )
  }, [chords])

  const fileSelector = useRef<HTMLInputElement>(null)
  const exportLink = useRef<HTMLAnchorElement>(null)

  return (
    <ActionBarContainer>
      <FixedSpacing style={{ justifyContent: 'flex-start' }}>
        {editorOpen && chordButtonSelected && !editMode && (
          <>
            <ActionButton
              icon={faCopy}
              text="Copy"
              hideText="1600px"
              color={FadedColors.secondary}
              onClick={() => dispatch(setEditMode('copy'))}
            />
            <ActionButton
              icon={faExchangeAlt}
              text="Swap"
              hideText="1600px"
              color={FadedColors.secondary}
              onClick={() => dispatch(setEditMode('swap'))}
            />
            <ActionButton
              icon={faTrashAlt}
              text="Clear chord"
              hideText="1600px"
              color={FadedColors.secondary}
              onClick={() => dispatch(clearChord())}
            />
          </>
        )}

        {editorOpen && chordButtonSelected && editMode && (
          <FixedSpacing>
            {editMode === 'copy' && <span className="text-high">Copy to...</span>}
            {editMode === 'swap' && <span className="text-high">Swap with...</span>}
            <ActionButton text="Cancel" onClick={() => dispatch(setEditMode(null))} />
          </FixedSpacing>
        )}
      </FixedSpacing>

      <FixedSpacing className="presets">
        <Dropdown placeholder="Load preset">
          <DropdownMenu>
            <DropdownHeader>Basic and substitute chords</DropdownHeader>
            <DropdownItem onClick={() => dispatch(loadChordMap('/disub/C'))}>C / Am</DropdownItem>
            <DropdownItem disabled>G / Em</DropdownItem>
            <DropdownDivider />
            <DropdownHeader>Songs</DropdownHeader>
            <DropdownItem
              onClick={() => dispatch(loadChordMap('/songs/Smile'))}
              text="Smile"
              description="Charlie Chaplin"
            />
            <DropdownItem
              onClick={() => dispatch(loadChordMap('/songs/Whiter'))}
              text="Whiter shade of pale"
              description="Procol Harum"
            />
          </DropdownMenu>
        </Dropdown>

        <a style={{ display: 'none' }} ref={exportLink} href={exportHref} download="My Chords.json">
          Export
        </a>

        <ActionButton
          text="Export"
          icon={faFileExport}
          onClick={() => exportLink.current?.click()}
          hideText="1200px"
          color={FadedColors.secondary}
        />

        <input
          style={{ display: 'none' }}
          ref={fileSelector}
          type="file"
          accept="application/json"
          onChange={() => {
            if (fileSelector.current) {
              readFile(fileSelector.current, (json) => dispatch(importChordMap(json)))
            }
          }}
        />

        <ActionButton
          text="Import"
          icon={faFileImport}
          onClick={() => fileSelector.current?.click()}
          hideText="1200px"
          color={FadedColors.secondary}
        />
      </FixedSpacing>
    </ActionBarContainer>
  )
}

function readFile(input: HTMLInputElement, onSuccess: (json: string) => void) {
  const file = input.files?.item(0)
  const reader = new FileReader()

  reader.onload = (event) => {
    const contents = event.target?.result
    if (contents) {
      onSuccess(contents.toString())
    } else {
      console.error('No contents')
    }
  }

  reader.onerror = (event) => {
    console.error(`File could not be read! Code ${event.target?.error?.code}`)
  }

  if (!file) {
    console.warn('No file selected')
  } else {
    reader.readAsText(file)
  }
}

export default ActionBar
