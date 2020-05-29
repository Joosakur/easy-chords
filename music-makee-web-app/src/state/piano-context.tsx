import React, {useCallback, useContext, useEffect, useState} from 'react'
import api from '../api/http-client'
import {SettingsContext} from './settings-context'
import SynthInstrument from '../utils/music/synth'
import {ChordV1} from '../types'
import {getAbsoluteNotes} from '../utils/music/chords'

interface PianoState {
  notesPlaying: number[],
  playNote: (note: number) => void,
  playChord: (chord: ChordV1, x: number, y: number) => void,
  stopNotes: () => void,
  sustainPedal: boolean,
  setSustainPedal: (val: boolean) => void
}

export const defaultState = {
  notesPlaying: [],
  playNote: () => {},
  playChord: () => {},
  stopNotes: () => {},
  sustainPedal: false,
  setSustainPedal: () => {}
}

export const PianoContext = React.createContext<PianoState>(defaultState)

interface PianoContextProviderProps {
  children: React.ReactNode
  synth?: SynthInstrument
}
export function PianoContextProvider({children, synth}: PianoContextProviderProps) {
  const { useMidiOutput, midiDeviceSelected } = useContext(SettingsContext)
  const [notesPlaying, setNotesPlaying] = useState<number[]>([])
  const [sustainPedal, setSustainPedal] = useState<boolean>(false)
  
  const channel = 1
  const velocity = 90
  
  const playNote = useCallback((note: number) => {
    if(!useMidiOutput && synth) {
      synth.playNote(note)
    }
  
    if(useMidiOutput && midiDeviceSelected !== null) {
      api.playNote({ channel, note, velocity })
    }
    
    setNotesPlaying([note])
  }, [useMidiOutput, midiDeviceSelected, synth])
  
  const playChord = useCallback((chord: ChordV1, x: number, y: number) => {
    const notes = getAbsoluteNotes(chord)
    if(!useMidiOutput && synth) {
      notes.forEach(synth.playNote)
    }
  
    const velocity = 50 + 60 * x
    if(useMidiOutput && midiDeviceSelected !== null) {
      api.playChord({
        playNotes: notes.map(note => ({ note, channel, velocity })),
        stopNotes: notesPlaying.map(note => ({ note, channel })),
      })
    }
    
    setNotesPlaying(notes)
  }, [useMidiOutput, midiDeviceSelected, notesPlaying, synth])
  
  const stopNotes = useCallback(() => {
    api.playChord({
      playNotes: [],
      stopNotes: notesPlaying.map(note => ({ note, channel })),
    })
    setNotesPlaying([])
  }, [notesPlaying])
  
  useEffect(() => {
    sustainPedal ? api.sendCC({channel: 1, cc: 64, value: 127}) : api.sendCC({channel: 1, cc: 64, value: 0})
  }, [sustainPedal])
  
  const value: PianoState = {
    notesPlaying,
    playNote,
    playChord,
    stopNotes,
    sustainPedal,
    setSustainPedal
  }
  
  return (
    <PianoContext.Provider value={value}>
      {children}
    </PianoContext.Provider>
  )
}
