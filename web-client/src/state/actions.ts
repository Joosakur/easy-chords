import { chooseMidiDevice as chooseMidiDeviceActions } from './settings/settings-saga-actions'

export const chooseMidiDevice = chooseMidiDeviceActions.requested

export { chordClicked, importChordMap, loadChordMap } from './chord-map/chord-map-saga-actions'
export { clearChord, setChord, setChords, setEditMode } from './chord-map/chord-map-slice'
export { playChord, playNote, setSustainPedal, stopNotes } from './piano/piano-saga-actions'
export { setHost, setMidiOutput } from './settings/settings-slice'
export {
  closeEditor,
  closeSettings,
  openEditor,
  openSettings,
  toggleEditor,
  toggleSettings,
} from './ui/ui-slice'
