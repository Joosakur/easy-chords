import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../root-reducer'

export interface UIState {
  settingsOpen: boolean
  editorOpen: boolean
}

export const initialUIState: UIState = {
  settingsOpen: false,
  editorOpen: false,
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
  },
})

export const selectIsEditorOpen = (state: RootState) => state.ui.editorOpen
export const selectIsSettingsOpen = (state: RootState) => state.ui.settingsOpen

export const {
  openSettings,
  closeSettings,
  toggleSettings,
  openEditor,
  closeEditor,
  toggleEditor,
} = uiSlice.actions

export default uiSlice.reducer
