import React, {useContext, useState} from 'react'
import {ChordV1} from '../types'
import {getAbsoluteNotes} from '../utils/music/chords'
import {PianoContext} from './piano-context'

export type EditMode = 'copy' | 'swap'

export interface EditState {
  mode: EditMode,
  target: number
}

interface ChordMapState {
  editorOpen: boolean,
  setEditorOpen: (val: boolean) => void,
  chords: (ChordV1 | null)[],
  setChords: (val: (ChordV1 | null)[]) => void,
  updateChord: (i: number, chord: ChordV1 | null) => void,
  activeChord: ChordV1 | null,
  activeChordIndex: number | null,
  setActiveChordIndex: (val: number | null) => void,
  playChord: (chord: ChordV1) => void,
  stopChord: () => void,
  editState: EditState | null
  setEditState: (state: EditState | null) => void,
  finishCopy: (to: number) => void,
  finishSwap: (withChord: number) => void,
  clear: () => void
}

const defaultChords: (ChordV1 | null)[] = [
  { name: 'C', root: 0, octave: 4, voicing: [0, 7, 16, 24]},
  { name: 'Dm', root: 2, octave: 4, voicing: [0, 7, 15, 24]},
  { name: 'Em', root: 4, octave: 4, voicing: [0, 7, 15, 24]},
  { name: 'F', root: 5, octave: 3, voicing: [0, 7, 16, 24]},
  { name: 'G', root: 7, octave: 3, voicing: [0, 7, 16, 24]},
  { name: 'Am', root: 9, octave: 3, voicing: [0, 7, 15, 24]},
  { name: 'Bdim', root: 11, octave: 3, voicing: [0, 6, 15, 24]},
  
  null, null, null, null, null, null, null,
  
  null, null, null, null, null, null, null,
  
  null, null, null, null, null, null, null
]

export const defaultState: ChordMapState = {
  editorOpen: false,
  setEditorOpen: () => {},
  chords: defaultChords,
  setChords: () => {},
  updateChord: () => {},
  activeChord: null,
  activeChordIndex: null,
  setActiveChordIndex: () => {},
  playChord: () => {},
  stopChord: () => {},
  editState: null,
  setEditState: () => {},
  finishCopy: () => {},
  finishSwap: () => {},
  clear: () => {}
}

export const ChordMapContext = React.createContext<ChordMapState>(defaultState)

export function ChordMapContextProvider(
  {children}: { children: React.ReactNode, }
  ) {
  const { playNotes, stopNotes } = useContext(PianoContext)
  
  const [editorOpen, setEditorOpen] = useState<boolean>(false)
  const [chords, setChords] = useState<(ChordV1 | null)[]>(defaultChords)
  const [activeChordIndex, setActiveChordIndex] = useState<(number | null)>(null)
  const [editState, setEditState] = useState<EditState | null>(null)
  
  const playChord = async (chord: ChordV1) => {
    playNotes(getAbsoluteNotes(chord))
  }

  const stopChord = () => {
    stopNotes()
  }

  const value: ChordMapState = {
    editorOpen,
    setEditorOpen: (open: boolean) => {
      if(!open) setEditState(null)
      setEditorOpen(open)
    },
    chords,
    setChords,
    updateChord: (i, chord) => {
      const updated = [...chords]
      updated[i] = chord
      setChords(updated)
    },
    activeChord: (editorOpen && activeChordIndex !== null && chords[activeChordIndex]) || null,
    activeChordIndex,
    setActiveChordIndex,
    playChord,
    stopChord,
    editState,
    setEditState,
    finishCopy: to => {
      if(editState && editState.mode === 'copy' && activeChordIndex !== null && to >= 0 && to < chords.length) {
        const nextChords = [...chords]
        nextChords.splice(to, 1, chords[activeChordIndex])
        setChords(nextChords)
      }
      setEditState(null)
    },
    finishSwap: withChord => {
      if(editState && editState.mode === 'swap' && activeChordIndex !== null && withChord >= 0 && withChord < chords.length) {
        const nextChords = [...chords]
        nextChords.splice(activeChordIndex, 1, chords[withChord])
        nextChords.splice(withChord, 1, chords[activeChordIndex])
        setChords(nextChords)
      }
      setEditState(null)
    },
    clear: () => {
      if(activeChordIndex !== null) {
        const nextChords = [...chords]
        nextChords.splice(activeChordIndex, 1, null)
        setChords(nextChords)
      }
    }
  }
  
  return (
    <ChordMapContext.Provider value={value}>
      {children}
    </ChordMapContext.Provider>
  )
}
