import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { MidiDevice } from '../../api/http-client'
import type { RootState } from '../root-reducer'
import { chooseMidiDevice, getMidiDevices } from './settings-saga-actions'

export interface SettingsState {
  midiOutput: boolean
  host: string
  midiDevices: MidiDevice[] | null
  midiDeviceIndex: number | null
}

export const initialSettingsState: SettingsState = {
  midiOutput: false,
  host: 'localhost',
  midiDevices: null,
  midiDeviceIndex: null,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    setMidiOutput: (state, action: PayloadAction<boolean>) => {
      state.midiOutput = action.payload
      if (!action.payload) {
        state.midiDevices = null
        state.midiDeviceIndex = null
      }
    },
    setHost: (state, action: PayloadAction<string>) => {
      state.host = action.payload
      state.midiDeviceIndex = null
      state.midiDevices = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chooseMidiDevice.fulfilled, (state, action) => {
        state.midiDeviceIndex = action.payload
      })
      .addCase(getMidiDevices.fulfilled, (state, action) => {
        state.midiDevices = action.payload
      })
      .addCase(getMidiDevices.rejected, (state) => {
        state.midiDevices = []
        state.midiDeviceIndex = null
      })
  },
})

export const selectSettings = (state: RootState) => state.settings
export const selectIsUsingMidi = createSelector(
  selectSettings,
  ({ midiOutput, host, midiDevices, midiDeviceIndex }) => {
    return (
      midiOutput &&
      host &&
      midiDeviceIndex !== null &&
      midiDevices &&
      midiDeviceIndex <= midiDevices.length - 1
    )
  },
)

export const { setMidiOutput, setHost } = settingsSlice.actions
export default settingsSlice.reducer
