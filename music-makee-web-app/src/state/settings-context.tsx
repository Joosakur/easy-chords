import React, {useState} from 'react'
import {MidiDevice} from '../api/http-client'

interface SettingsState {
  settingsOpen: boolean,
  setSettingsOpen: (val: boolean) => any,
  useMidiOutput: boolean,
  setUseMidiOutput: (val: boolean) => any,
  host: string,
  setHost: (val: string) => any,
  midiDevices: MidiDevice[] | null,
  setMidiDevices: (val: MidiDevice[] | null) => any,
  midiDeviceSelected: number | null,
  setMidiDeviceSelected: (val: number | null) => any
}

export const SettingsContext = React.createContext<SettingsState>({
  settingsOpen: false,
  setSettingsOpen: () => undefined,
  useMidiOutput: false,
  setUseMidiOutput: () => undefined,
  host: 'localhost',
  setHost: () => undefined,
  midiDevices: null,
  setMidiDevices: () => undefined,
  midiDeviceSelected: null,
  setMidiDeviceSelected: () => undefined
})

export function SettingsContextProvider({children}: { children: React.ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
  const [useMidiOutput, setUseMidiOutput] = useState<boolean>(false)
  const [host, setHost] = useState<string>('localhost')
  const [midiDevices, setMidiDevices] = useState<MidiDevice[] | null>(null)
  const [midiDeviceSelected, setMidiDeviceSelected] = useState<number | null>(null)
  
  const value: SettingsState = {
    settingsOpen,
    setSettingsOpen,
    useMidiOutput,
    setUseMidiOutput,
    host,
    setHost,
    midiDevices,
    setMidiDevices,
    midiDeviceSelected,
    setMidiDeviceSelected
  }
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
