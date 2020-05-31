import { chooseMidiDevice as chooseMidiDeviceActions } from './settings/settings-saga-actions'

export const chooseMidiDevice = chooseMidiDeviceActions.requested

export { setHost, setMidiOutput } from './settings/settings-slice'

export {
  openEditor,
  openSettings,
  closeEditor,
  closeSettings,
  toggleEditor,
  toggleSettings
} from './ui/ui-slice'

export { setEditMode, setChords, setChord, clearChord } from './chord-map/chord-map-slice'

export { importChordMap } from './chord-map/chord-map-saga-actions'
export { loadChordMap } from './chord-map/chord-map-saga-actions'
export { chordClicked } from './chord-map/chord-map-saga-actions'
export { setSustainPedal } from './piano/piano-saga-actions'
export { stopNotes } from './piano/piano-saga-actions'
export { playChord } from './piano/piano-saga-actions'
export { playNote } from './piano/piano-saga-actions'
