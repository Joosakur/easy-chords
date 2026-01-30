import { describe, expect, it } from 'vitest'
import type { RootState } from '../root-reducer'
import { setSustainPedal } from './piano-saga-actions'
import reducer, {
  initialPianoState,
  type PianoState,
  pianoKeyDown,
  pianoKeysUp,
  pianoKeyUp,
  selectIsKeyDown,
  selectKeysDown,
  selectPiano,
  selectSustainPedal,
} from './piano-slice'

const createRootState = (piano: Partial<PianoState> = {}): RootState =>
  ({
    piano: { ...initialPianoState, ...piano },
  }) as RootState

describe('piano slice', () => {
  describe('reducers', () => {
    describe('pianoKeyDown', () => {
      it('adds a key to keysDown', () => {
        const state = reducer(initialPianoState, pianoKeyDown(60))
        expect(state.keysDown).toContain(60)
      })

      it('adds multiple keys', () => {
        let state = reducer(initialPianoState, pianoKeyDown(60))
        state = reducer(state, pianoKeyDown(64))
        state = reducer(state, pianoKeyDown(67))
        expect(state.keysDown).toEqual([60, 64, 67])
      })

      it('allows duplicate keys', () => {
        let state = reducer(initialPianoState, pianoKeyDown(60))
        state = reducer(state, pianoKeyDown(60))
        expect(state.keysDown).toEqual([60, 60])
      })
    })

    describe('pianoKeyUp', () => {
      it('removes a key from keysDown', () => {
        const stateWithKeys: PianoState = {
          ...initialPianoState,
          keysDown: [60, 64, 67],
        }
        const state = reducer(stateWithKeys, pianoKeyUp(64))
        expect(state.keysDown).toEqual([60, 67])
      })

      it('does nothing if key is not down', () => {
        const stateWithKeys: PianoState = {
          ...initialPianoState,
          keysDown: [60, 67],
        }
        const state = reducer(stateWithKeys, pianoKeyUp(64))
        expect(state.keysDown).toEqual([60, 67])
      })

      it('removes all instances of the key', () => {
        const stateWithDuplicates: PianoState = {
          ...initialPianoState,
          keysDown: [60, 64, 60, 67],
        }
        const state = reducer(stateWithDuplicates, pianoKeyUp(60))
        expect(state.keysDown).toEqual([64, 67])
      })
    })

    describe('pianoKeysUp', () => {
      it('clears all keys', () => {
        const stateWithKeys: PianoState = {
          ...initialPianoState,
          keysDown: [60, 64, 67, 72],
        }
        const state = reducer(stateWithKeys, pianoKeysUp())
        expect(state.keysDown).toEqual([])
      })

      it('does nothing if already empty', () => {
        const state = reducer(initialPianoState, pianoKeysUp())
        expect(state.keysDown).toEqual([])
      })
    })

    describe('extraReducers', () => {
      it('handles setSustainPedal true', () => {
        const state = reducer(initialPianoState, setSustainPedal(true))
        expect(state.sustainPedal).toBe(true)
      })

      it('handles setSustainPedal false', () => {
        const stateWithSustain: PianoState = {
          ...initialPianoState,
          sustainPedal: true,
        }
        const state = reducer(stateWithSustain, setSustainPedal(false))
        expect(state.sustainPedal).toBe(false)
      })
    })
  })

  describe('selectors', () => {
    describe('selectPiano', () => {
      it('returns piano state', () => {
        const rootState = createRootState({ keysDown: [60, 64] })
        expect(selectPiano(rootState)).toEqual({
          ...initialPianoState,
          keysDown: [60, 64],
        })
      })
    })

    describe('selectKeysDown', () => {
      it('returns empty array when no keys down', () => {
        const rootState = createRootState()
        expect(selectKeysDown(rootState)).toEqual([])
      })

      it('returns keys down', () => {
        const rootState = createRootState({ keysDown: [60, 64, 67] })
        expect(selectKeysDown(rootState)).toEqual([60, 64, 67])
      })
    })

    describe('selectIsKeyDown', () => {
      it('returns false when key is not down', () => {
        const rootState = createRootState({ keysDown: [60, 67] })
        const selector = selectIsKeyDown(64)
        expect(selector(rootState)).toBe(false)
      })

      it('returns true when key is down', () => {
        const rootState = createRootState({ keysDown: [60, 64, 67] })
        const selector = selectIsKeyDown(64)
        expect(selector(rootState)).toBe(true)
      })

      it('returns false when no keys down', () => {
        const rootState = createRootState()
        const selector = selectIsKeyDown(60)
        expect(selector(rootState)).toBe(false)
      })
    })

    describe('selectSustainPedal', () => {
      it('returns false when sustain is off', () => {
        const rootState = createRootState({ sustainPedal: false })
        expect(selectSustainPedal(rootState)).toBe(false)
      })

      it('returns true when sustain is on', () => {
        const rootState = createRootState({ sustainPedal: true })
        expect(selectSustainPedal(rootState)).toBe(true)
      })
    })
  })
})
