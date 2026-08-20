import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../root-reducer'

export interface UIState {
  settingsOpen: boolean
  editorOpen: boolean
  ccPadOpen: boolean
}

export const initialUIState: UIState = {
  settingsOpen: false,
  editorOpen: false,
  ccPadOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    openSettings: (state) => {
      state.settingsOpen = true
    },
    closeSettings: (state) => {
      state.settingsOpen = false
    },
    toggleSettings: (state) => {
      state.settingsOpen = !state.settingsOpen
    },
    openEditor: (state) => {
      state.editorOpen = true
    },
    closeEditor: (state) => {
      state.editorOpen = false
    },
    toggleEditor: (state) => {
      state.editorOpen = !state.editorOpen
    },
    toggleCcPad: (state) => {
      state.ccPadOpen = !state.ccPadOpen
      // The chord editor edits the grid, which the pad hides
      if (state.ccPadOpen) state.editorOpen = false
    },
  },
})

export const selectIsEditorOpen = (state: RootState) => state.ui.editorOpen
export const selectIsSettingsOpen = (state: RootState) => state.ui.settingsOpen
export const selectIsCcPadOpen = (state: RootState) => state.ui.ccPadOpen

export const {
  openSettings,
  closeSettings,
  toggleSettings,
  openEditor,
  closeEditor,
  toggleEditor,
  toggleCcPad,
} = uiSlice.actions

export default uiSlice.reducer
