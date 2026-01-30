import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../root-reducer'
import { setSustainPedal } from './piano-saga-actions'

export interface PianoState {
  keysDown: number[]
  sustainPedal: boolean
}

export const initialPianoState: PianoState = {
  keysDown: [],
  sustainPedal: false,
}

const pianoSlice = createSlice({
  name: 'piano',
  initialState: initialPianoState,
  reducers: {
    pianoKeyDown: (state, action: PayloadAction<number>) => {
      state.keysDown.push(action.payload)
    },
    pianoKeyUp: (state, action: PayloadAction<number>) => {
      state.keysDown = state.keysDown.filter((n) => n !== action.payload)
    },
    pianoKeysUp: (state) => {
      state.keysDown = []
    },
  },
  extraReducers: {
    [setSustainPedal.type]: (state, action: PayloadAction<boolean>) => {
      state.sustainPedal = action.payload
    },
  },
})

export const selectPiano = (state: RootState) => state.piano
export const selectKeysDown = createSelector(selectPiano, (piano) => piano.keysDown)
export const selectIsKeyDown = (key: number) =>
  createSelector(selectKeysDown, (keys) => keys.includes(key))
export const selectSustainPedal = createSelector(selectPiano, (piano) => piano.sustainPedal)

export const { pianoKeyDown, pianoKeyUp, pianoKeysUp } = pianoSlice.actions

export default pianoSlice.reducer
