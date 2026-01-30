import { describe, expect, it } from 'vitest'
import type { RootState } from '../root-reducer'
import { chooseMidiDevice, getMidiDevices } from './settings-saga-actions'
import reducer, {
  initialSettingsState,
  type SettingsState,
  selectIsUsingMidi,
  selectSettings,
  setHost,
  setMidiOutput,
} from './settings-slice'

const createRootState = (settings: Partial<SettingsState> = {}): RootState =>
  ({
    settings: { ...initialSettingsState, ...settings },
  }) as RootState

describe('settings slice', () => {
  describe('reducers', () => {
    describe('setMidiOutput', () => {
      it('enables MIDI output', () => {
        const state = reducer(initialSettingsState, setMidiOutput(true))
        expect(state.midiOutput).toBe(true)
      })

      it('disables MIDI output and clears device state', () => {
        const stateWithDevices: SettingsState = {
          ...initialSettingsState,
          midiOutput: true,
          midiDevices: [{ name: 'Device 1', description: 'Test Device 1' }],
          midiDeviceIndex: 0,
        }
        const state = reducer(stateWithDevices, setMidiOutput(false))
        expect(state.midiOutput).toBe(false)
        expect(state.midiDevices).toBeNull()
        expect(state.midiDeviceIndex).toBeNull()
      })

      it('keeps device state when enabling', () => {
        const stateWithDevices: SettingsState = {
          ...initialSettingsState,
          midiDevices: [{ name: 'Device 1', description: 'Test Device 1' }],
          midiDeviceIndex: 0,
        }
        const state = reducer(stateWithDevices, setMidiOutput(true))
        expect(state.midiOutput).toBe(true)
        expect(state.midiDevices).toEqual([{ name: 'Device 1', description: 'Test Device 1' }])
        expect(state.midiDeviceIndex).toBe(0)
      })
    })

    describe('setHost', () => {
      it('updates host', () => {
        const state = reducer(initialSettingsState, setHost('192.168.1.100'))
        expect(state.host).toBe('192.168.1.100')
      })

      it('clears device state when host changes', () => {
        const stateWithDevices: SettingsState = {
          ...initialSettingsState,
          midiDevices: [{ name: 'Device 1', description: 'Test Device 1' }],
          midiDeviceIndex: 0,
        }
        const state = reducer(stateWithDevices, setHost('new-host'))
        expect(state.host).toBe('new-host')
        expect(state.midiDevices).toBeNull()
        expect(state.midiDeviceIndex).toBeNull()
      })
    })

    describe('extraReducers', () => {
      it('handles chooseMidiDevice.fulfilled', () => {
        const state = reducer(initialSettingsState, chooseMidiDevice.fulfilled(1))
        expect(state.midiDeviceIndex).toBe(1)
      })

      it('handles getMidiDevices.fulfilled', () => {
        const devices = [
          { name: 'Device 1', description: 'Test Device 1' },
          { name: 'Device 2', description: 'Test Device 2' },
        ]
        const state = reducer(initialSettingsState, getMidiDevices.fulfilled(devices))
        expect(state.midiDevices).toEqual(devices)
      })

      it('handles getMidiDevices.rejected', () => {
        const stateWithDevices: SettingsState = {
          ...initialSettingsState,
          midiDevices: [{ name: 'Device 1', description: 'Test Device 1' }],
          midiDeviceIndex: 0,
        }
        const state = reducer(stateWithDevices, getMidiDevices.rejected())
        expect(state.midiDevices).toEqual([])
        expect(state.midiDeviceIndex).toBeNull()
      })
    })
  })

  describe('selectors', () => {
    describe('selectSettings', () => {
      it('returns settings state', () => {
        const rootState = createRootState({ host: 'test-host' })
        expect(selectSettings(rootState)).toEqual({
          ...initialSettingsState,
          host: 'test-host',
        })
      })
    })

    describe('selectIsUsingMidi', () => {
      it('returns false when midiOutput is disabled', () => {
        const rootState = createRootState({
          midiOutput: false,
          host: 'localhost',
          midiDevices: [{ name: 'Device', description: 'Test Device' }],
          midiDeviceIndex: 0,
        })
        expect(selectIsUsingMidi(rootState)).toBe(false)
      })

      it('returns falsy when host is empty', () => {
        const rootState = createRootState({
          midiOutput: true,
          host: '',
          midiDevices: [{ name: 'Device', description: 'Test Device' }],
          midiDeviceIndex: 0,
        })
        expect(selectIsUsingMidi(rootState)).toBeFalsy()
      })

      it('returns false when midiDeviceIndex is null', () => {
        const rootState = createRootState({
          midiOutput: true,
          host: 'localhost',
          midiDevices: [{ name: 'Device', description: 'Test Device' }],
          midiDeviceIndex: null,
        })
        expect(selectIsUsingMidi(rootState)).toBe(false)
      })

      it('returns falsy when midiDevices is null', () => {
        const rootState = createRootState({
          midiOutput: true,
          host: 'localhost',
          midiDevices: null,
          midiDeviceIndex: 0,
        })
        expect(selectIsUsingMidi(rootState)).toBeFalsy()
      })

      it('returns false when midiDeviceIndex exceeds device count', () => {
        const rootState = createRootState({
          midiOutput: true,
          host: 'localhost',
          midiDevices: [{ name: 'Device', description: 'Test Device' }],
          midiDeviceIndex: 5,
        })
        expect(selectIsUsingMidi(rootState)).toBe(false)
      })

      it('returns true when all conditions are met', () => {
        const rootState = createRootState({
          midiOutput: true,
          host: 'localhost',
          midiDevices: [
            { name: 'Device 1', description: 'Test Device 1' },
            { name: 'Device 2', description: 'Test Device 2' },
          ],
          midiDeviceIndex: 1,
        })
        expect(selectIsUsingMidi(rootState)).toBe(true)
      })

      it('returns true for first device (index 0)', () => {
        const rootState = createRootState({
          midiOutput: true,
          host: 'localhost',
          midiDevices: [{ name: 'Device', description: 'Test Device' }],
          midiDeviceIndex: 0,
        })
        expect(selectIsUsingMidi(rootState)).toBe(true)
      })
    })
  })
})
