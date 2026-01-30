import { describe, expect, it } from 'vitest'
import type { ChordV1 } from '../../types'
import type { RootState } from '../root-reducer'
import reducer, {
  type ChordMapState,
  clearChord,
  initialChordMapState,
  selectActiveChord,
  selectActiveChordIndex,
  selectChordMap,
  selectChords,
  selectEditMode,
  selectIsChordButtonSelected,
  setActiveChordIndex,
  setChord,
  setChords,
  setEditMode,
} from './chord-map-slice'

const createRootState = (chordMap: Partial<ChordMapState> = {}): RootState =>
  ({
    chordMap: { ...initialChordMapState, ...chordMap },
  }) as RootState

const testChord: ChordV1 = {
  name: 'Test',
  root: 0,
  octave: 4,
  voicing: [0, 4, 7],
}

const anotherChord: ChordV1 = {
  name: 'Another',
  root: 5,
  octave: 3,
  voicing: [0, 4, 7],
}

describe('chord-map slice', () => {
  describe('reducers', () => {
    describe('setEditMode', () => {
      it('sets edit mode to copy', () => {
        const state = reducer(initialChordMapState, setEditMode('copy'))
        expect(state.editMode).toBe('copy')
      })

      it('sets edit mode to swap', () => {
        const state = reducer(initialChordMapState, setEditMode('swap'))
        expect(state.editMode).toBe('swap')
      })

      it('clears edit mode', () => {
        const stateWithMode: ChordMapState = { ...initialChordMapState, editMode: 'copy' }
        const state = reducer(stateWithMode, setEditMode(null))
        expect(state.editMode).toBeNull()
      })
    })

    describe('setChords', () => {
      it('replaces all chords', () => {
        const newChords = [testChord, null, anotherChord]
        const state = reducer(initialChordMapState, setChords(newChords))
        expect(state.chords).toEqual(newChords)
      })

      it('clears activeChordIndex', () => {
        const stateWithActive: ChordMapState = {
          ...initialChordMapState,
          activeChordIndex: 5,
        }
        const state = reducer(stateWithActive, setChords([testChord]))
        expect(state.activeChordIndex).toBeNull()
      })

      it('clears editMode', () => {
        const stateWithMode: ChordMapState = {
          ...initialChordMapState,
          editMode: 'copy',
        }
        const state = reducer(stateWithMode, setChords([testChord]))
        expect(state.editMode).toBeNull()
      })
    })

    describe('setChord', () => {
      it('sets chord at specified index', () => {
        const state = reducer(initialChordMapState, setChord({ chord: testChord, index: 10 }))
        expect(state.chords[10]).toEqual(testChord)
      })

      it('sets chord at activeChordIndex when index not specified', () => {
        const stateWithActive: ChordMapState = {
          ...initialChordMapState,
          activeChordIndex: 5,
        }
        const state = reducer(stateWithActive, setChord({ chord: testChord }))
        expect(state.chords[5]).toEqual(testChord)
      })

      it('does nothing when no index and no activeChordIndex', () => {
        const state = reducer(initialChordMapState, setChord({ chord: testChord }))
        // Original state should be unchanged (default chords)
        expect(state.chords).toEqual(initialChordMapState.chords)
      })

      it('can set chord to null', () => {
        const stateWithChord: ChordMapState = {
          ...initialChordMapState,
          chords: [...initialChordMapState.chords],
        }
        stateWithChord.chords[10] = testChord
        const state = reducer(stateWithChord, setChord({ chord: null, index: 10 }))
        expect(state.chords[10]).toBeNull()
      })
    })

    describe('setActiveChordIndex', () => {
      it('sets active chord index', () => {
        const state = reducer(initialChordMapState, setActiveChordIndex(3))
        expect(state.activeChordIndex).toBe(3)
      })

      it('clears active chord index', () => {
        const stateWithActive: ChordMapState = {
          ...initialChordMapState,
          activeChordIndex: 5,
        }
        const state = reducer(stateWithActive, setActiveChordIndex(null))
        expect(state.activeChordIndex).toBeNull()
      })
    })

    describe('clearChord', () => {
      it('clears chord at active index', () => {
        const stateWithChord: ChordMapState = {
          ...initialChordMapState,
          chords: [...initialChordMapState.chords],
          activeChordIndex: 0,
        }
        const state = reducer(stateWithChord, clearChord())
        expect(state.chords[0]).toBeNull()
      })

      it('does nothing when no active chord', () => {
        const state = reducer(initialChordMapState, clearChord())
        expect(state.chords).toEqual(initialChordMapState.chords)
      })
    })
  })

  describe('selectors', () => {
    describe('selectChordMap', () => {
      it('returns chordMap state', () => {
        const rootState = createRootState({ editMode: 'copy' })
        expect(selectChordMap(rootState)).toEqual({
          ...initialChordMapState,
          editMode: 'copy',
        })
      })
    })

    describe('selectEditMode', () => {
      it('returns null when no edit mode', () => {
        const rootState = createRootState()
        expect(selectEditMode(rootState)).toBeNull()
      })

      it('returns copy mode', () => {
        const rootState = createRootState({ editMode: 'copy' })
        expect(selectEditMode(rootState)).toBe('copy')
      })

      it('returns swap mode', () => {
        const rootState = createRootState({ editMode: 'swap' })
        expect(selectEditMode(rootState)).toBe('swap')
      })
    })

    describe('selectChords', () => {
      it('returns chords array', () => {
        const chords = [testChord, null, anotherChord]
        const rootState = createRootState({ chords })
        expect(selectChords(rootState)).toEqual(chords)
      })
    })

    describe('selectActiveChordIndex', () => {
      it('returns null when no active chord', () => {
        const rootState = createRootState()
        expect(selectActiveChordIndex(rootState)).toBeNull()
      })

      it('returns active chord index', () => {
        const rootState = createRootState({ activeChordIndex: 7 })
        expect(selectActiveChordIndex(rootState)).toBe(7)
      })
    })

    describe('selectIsChordButtonSelected', () => {
      it('returns false when no chord is selected', () => {
        const rootState = createRootState({ activeChordIndex: null })
        expect(selectIsChordButtonSelected(rootState)).toBe(false)
      })

      it('returns true when a chord is selected', () => {
        const rootState = createRootState({ activeChordIndex: 0 })
        expect(selectIsChordButtonSelected(rootState)).toBe(true)
      })

      it('returns true for any valid index', () => {
        const rootState = createRootState({ activeChordIndex: 15 })
        expect(selectIsChordButtonSelected(rootState)).toBe(true)
      })
    })

    describe('selectActiveChord', () => {
      it('returns null when no active chord index', () => {
        const rootState = createRootState({ activeChordIndex: null })
        expect(selectActiveChord(rootState)).toBeNull()
      })

      it('returns null when active index points to null chord', () => {
        const chords = [testChord, null, anotherChord]
        const rootState = createRootState({ chords, activeChordIndex: 1 })
        expect(selectActiveChord(rootState)).toBeNull()
      })

      it('returns chord at active index', () => {
        const chords = [testChord, null, anotherChord]
        const rootState = createRootState({ chords, activeChordIndex: 0 })
        expect(selectActiveChord(rootState)).toEqual(testChord)
      })

      it('returns correct chord for any valid index', () => {
        const chords = [testChord, null, anotherChord]
        const rootState = createRootState({ chords, activeChordIndex: 2 })
        expect(selectActiveChord(rootState)).toEqual(anotherChord)
      })
    })
  })
})
