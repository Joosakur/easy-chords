import { ChordV1 } from '../../types'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../root-reducer'

export type EditMode = 'copy' | 'swap' | null

export interface ChordMapState {
  chords: (ChordV1 | null)[]
  activeChordIndex: number | null
  editMode: EditMode
}

const defaultChords: (ChordV1 | null)[] = [
  { name: 'C', root: 0, octave: 4, voicing: [0, 7, 16, 24] },
  { name: 'Dm', root: 2, octave: 4, voicing: [0, 7, 15, 24] },
  { name: 'Em', root: 4, octave: 4, voicing: [0, 7, 15, 24] },
  { name: 'F', root: 5, octave: 3, voicing: [0, 7, 16, 24] },
  { name: 'G', root: 7, octave: 3, voicing: [0, 7, 16, 24] },
  { name: 'Am', root: 9, octave: 3, voicing: [0, 7, 15, 24] },
  { name: 'Bdim', root: 11, octave: 3, voicing: [0, 6, 15, 24] },

  null,
  null,
  null,
  null,
  null,
  null,
  null,

  null,
  null,
  null,
  null,
  null,
  null,
  null,

  null,
  null,
  null,
  null,
  null,
  null,
  null
]

export const initialChordMapState: ChordMapState = {
  chords: defaultChords,
  activeChordIndex: null,
  editMode: null
}

export const selectChordMap = (state: RootState) => state.chordMap
export const selectEditMode = createSelector(selectChordMap, (chordMap) => chordMap.editMode)
export const selectChords = createSelector(selectChordMap, (chordMap) => chordMap.chords)
export const selectActiveChordIndex = createSelector(
  selectChordMap,
  (chordMap) => chordMap.activeChordIndex
)
export const selectIsChordButtonSelected = createSelector(
  selectChordMap,
  (chordMap) => chordMap.activeChordIndex !== null
)
export const selectActiveChord = createSelector(
  selectChords,
  selectActiveChordIndex,
  (chords, activeChordIndex) => {
    return chords && activeChordIndex !== null ? chords[activeChordIndex] : null
  }
)

const chordMapSlice = createSlice({
  name: 'chordMap',
  initialState: initialChordMapState,
  reducers: {
    setEditMode: (state, action: PayloadAction<EditMode>) => {
      state.editMode = action.payload
    },
    setChords: (state, action: PayloadAction<(ChordV1 | null)[]>) => {
      state.chords = action.payload
      state.activeChordIndex = null
      state.editMode = null
    },
    setChord: (state, action: PayloadAction<{ chord: ChordV1 | null; index?: number }>) => {
      const { chord, index = state.activeChordIndex } = action.payload
      if (index !== null) state.chords[index] = chord
    },
    setActiveChordIndex: (state, action: PayloadAction<number | null>) => {
      state.activeChordIndex = action.payload
    },
    clearChord: (state) => {
      if (state.activeChordIndex !== null) state.chords[state.activeChordIndex] = null
    }
  }
})

export const {
  setEditMode,
  setChords,
  setChord,
  setActiveChordIndex,
  clearChord
} = chordMapSlice.actions

export default chordMapSlice.reducer
