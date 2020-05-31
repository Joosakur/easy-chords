import {combineReducers} from 'redux'
import settingsReducer, {initialSettingsState, SettingsState} from './settings/settings-slice'
import uiReducer, {initialUIState, UIState} from './ui/ui-slice'
import chordMapReducer, {ChordMapState, initialChordMapState} from './chord-map/chord-map-slice'
import pianoReducer, {initialPianoState, PianoState} from './piano/piano-slice'

export interface RootState {
  settings: SettingsState,
  ui: UIState,
  chordMap: ChordMapState,
  piano: PianoState
}

export const initialRootState: RootState = {
  settings: initialSettingsState,
  ui: initialUIState,
  chordMap: initialChordMapState,
  piano: initialPianoState
}

const rootReducer = combineReducers<RootState>({
  settings: settingsReducer,
  ui: uiReducer,
  chordMap: chordMapReducer,
  piano: pianoReducer
})

export default rootReducer
