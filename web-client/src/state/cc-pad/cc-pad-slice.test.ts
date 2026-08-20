import { describe, expect, it } from 'vitest'
import type { RootState } from '../root-reducer'
import { setMidiOutput } from '../settings/settings-slice'
import reducer, {
  type CcPadState,
  initialCcPadState,
  selectCcPadAxes,
  selectCcPadValue,
  setAxisCc,
  setAxisEnabled,
  setAxisMax,
  setAxisMin,
  setAxisSize,
  setPadValue,
} from './cc-pad-slice'

const createRootState = (ccPad: Partial<CcPadState> = {}): RootState =>
  ({
    ccPad: { ...initialCcPadState, ...ccPad },
  }) as RootState

describe('cc pad slice', () => {
  describe('defaults', () => {
    it('starts with modulation on X and expression on Y over the full range', () => {
      expect(initialCcPadState.x).toMatchObject({ enabled: true, cc: 1, min: 0, max: 127 })
      expect(initialCcPadState.y).toMatchObject({ enabled: true, cc: 11, min: 0, max: 127 })
      expect(initialCcPadState.x.sizePercent).toBe(50)
      expect(initialCcPadState.y.sizePercent).toBe(50)
    })

    it('starts with no value on either axis', () => {
      expect(initialCcPadState.value).toEqual({ x: null, y: null })
    })
  })

  describe('reducers', () => {
    it('assigns a CC number to an axis', () => {
      const state = reducer(initialCcPadState, setAxisCc({ axis: 'x', value: 74 }))
      expect(state.x.cc).toBe(74)
      expect(state.y.cc).toBe(11)
    })

    it('narrows the range of an axis', () => {
      let state = reducer(initialCcPadState, setAxisMin({ axis: 'y', value: 40 }))
      state = reducer(state, setAxisMax({ axis: 'y', value: 80 }))
      expect(state.y).toMatchObject({ min: 40, max: 80 })
    })

    it('allows min above max, which inverts the axis', () => {
      const state = reducer(initialCcPadState, setAxisMin({ axis: 'y', value: 127 }))
      expect(state.y.min).toBe(127)
      expect(state.y.max).toBe(127)
    })

    it('clamps CC numbers and range values into the MIDI range', () => {
      let state = reducer(initialCcPadState, setAxisCc({ axis: 'x', value: 999 }))
      state = reducer(state, setAxisMin({ axis: 'x', value: -20 }))
      expect(state.x.cc).toBe(127)
      expect(state.x.min).toBe(0)
    })

    it('falls back to zero for values that are not numbers', () => {
      const state = reducer(initialCcPadState, setAxisCc({ axis: 'x', value: Number.NaN }))
      expect(state.x.cc).toBe(0)
    })

    it('disables an axis', () => {
      const state = reducer(initialCcPadState, setAxisEnabled({ axis: 'y', value: false }))
      expect(state.y.enabled).toBe(false)
      expect(state.x.enabled).toBe(true)
    })

    it('resizes an axis and clamps to the allowed sizes', () => {
      let state = reducer(initialCcPadState, setAxisSize({ axis: 'x', value: 50 }))
      expect(state.x.sizePercent).toBe(50)

      state = reducer(state, setAxisSize({ axis: 'x', value: 10 }))
      expect(state.x.sizePercent).toBe(25)

      state = reducer(state, setAxisSize({ axis: 'x', value: 200 }))
      expect(state.x.sizePercent).toBe(100)
    })

    it('records the values that were sent', () => {
      const state = reducer(initialCcPadState, setPadValue({ x: 20, y: 90 }))
      expect(state.value).toEqual({ x: 20, y: 90 })
    })

    it('forgets the sent values when MIDI output is switched off', () => {
      const withValues = reducer(initialCcPadState, setPadValue({ x: 20, y: 90 }))
      const state = reducer(withValues, setMidiOutput(false))
      expect(state.value).toEqual({ x: null, y: null })
    })
  })

  describe('selectors', () => {
    it('selectCcPadAxes returns both axis configurations', () => {
      const axes = selectCcPadAxes(createRootState())
      expect(axes.x.cc).toBe(1)
      expect(axes.y.cc).toBe(11)
    })

    it('selectCcPadValue returns the last sent values', () => {
      const state = createRootState({ value: { x: 5, y: 6 } })
      expect(selectCcPadValue(state)).toEqual({ x: 5, y: 6 })
    })
  })
})
