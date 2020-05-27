import React, {useContext, useEffect, useState} from 'react'
import api from '../api/http-client'
import {SettingsContext} from './settings-context'
import SynthInstrument from '../utils/music/synth'

interface PianoState {
  notesPlaying: number[],
  playNote: (note: number) => void,
  playNotes: (notes: number[]) => void,
  stopNotes: () => void,
  sustainPedal: boolean,
  setSustainPedal: (val: boolean) => void
}

export const defaultState = {
  notesPlaying: [],
  playNote: () => {},
  playNotes: () => {},
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
  
  const playNote = (note: number) => {
    if(!useMidiOutput && synth) {
      synth.playNote(note)
    }
  
    if(useMidiOutput && midiDeviceSelected !== null) {
      api.playNote({ channel, note, velocity })
    }
    setNotesPlaying([note])
  }
  
  const playNotes = (notes: number[]) => {
    if(!useMidiOutput && synth) {
      notes.forEach(synth.playNote)
    }
  
    if(useMidiOutput && midiDeviceSelected !== null) {
      api.playChord({
        playNotes: notes.map(note => ({ note, channel, velocity: 90 })),
        stopNotes: notesPlaying.map(note => ({ note, channel })),
      })
      setNotesPlaying(notes)
    }
  }
  
  const stopNotes = () => {
    api.playChord({
      playNotes: [],
      stopNotes: notesPlaying.map(note => ({ note, channel })),
    })
    setNotesPlaying([])
  }
  
  useEffect(() => {
    sustainPedal ? api.sendCC({channel: 1, cc: 64, value: 127}) : api.sendCC({channel: 1, cc: 64, value: 0})
  }, [sustainPedal])
  
  const value: PianoState = {
    notesPlaying,
    playNote,
    playNotes,
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
