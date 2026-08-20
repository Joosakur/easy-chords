import { combineReducers } from 'redux'
import ccPadReducer, { type CcPadState, initialCcPadState } from './cc-pad/cc-pad-slice'
import chordMapReducer, {
  type ChordMapState,
  initialChordMapState,
} from './chord-map/chord-map-slice'
import pianoReducer, { initialPianoState, type PianoState } from './piano/piano-slice'
import settingsReducer, {
  initialSettingsState,
  type SettingsState,
} from './settings/settings-slice'
import uiReducer, { initialUIState, type UIState } from './ui/ui-slice'

export interface RootState {
  settings: SettingsState
  ui: UIState
  chordMap: ChordMapState
  piano: PianoState
  ccPad: CcPadState
}

export const initialRootState: RootState = {
  settings: initialSettingsState,
  ui: initialUIState,
  chordMap: initialChordMapState,
  piano: initialPianoState,
  ccPad: initialCcPadState,
}

const rootReducer = combineReducers({
  settings: settingsReducer,
  ui: uiReducer,
  chordMap: chordMapReducer,
  piano: pianoReducer,
  ccPad: ccPadReducer,
})

export default rootReducer
