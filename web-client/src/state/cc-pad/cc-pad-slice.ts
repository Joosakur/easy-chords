import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { CC_PAD } from '../../config/constants'
import type { RootState } from '../root-reducer'
import { setMidiOutput } from '../settings/settings-slice'

export type CcAxis = 'x' | 'y'

export interface CcAxisState {
  enabled: boolean
  cc: number
  /** Value at the left / bottom edge of the pad */
  min: number
  /** Value at the right / top edge of the pad. May be below min, which inverts the axis. */
  max: number
  /** Pad size along this axis, as a percentage of the available area */
  sizePercent: number
}

export interface CcPadState {
  x: CcAxisState
  y: CcAxisState
  /** Last value sent on each axis, or null while we do not know what the receiver holds */
  value: Record<CcAxis, number | null>
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const toMidiValue = (value: number) =>
  Number.isFinite(value) ? clamp(Math.round(value), CC_PAD.MIN, CC_PAD.MAX) : CC_PAD.MIN

const sizes = CC_PAD.SIZE_PERCENTS
const noValue: Record<CcAxis, number | null> = { x: null, y: null }

const defaultAxis = (cc: number): CcAxisState => ({
  enabled: true,
  cc,
  min: CC_PAD.MIN,
  max: CC_PAD.MAX,
  sizePercent: CC_PAD.DEFAULT_SIZE_PERCENT,
})

export const initialCcPadState: CcPadState = {
  x: defaultAxis(CC_PAD.DEFAULT_X_CC),
  y: defaultAxis(CC_PAD.DEFAULT_Y_CC),
  value: noValue,
}

interface AxisPayload<T> {
  axis: CcAxis
  value: T
}

const ccPadSlice = createSlice({
  name: 'ccPad',
  initialState: initialCcPadState,
  reducers: {
    setAxisEnabled: (state, action: PayloadAction<AxisPayload<boolean>>) => {
      state[action.payload.axis].enabled = action.payload.value
    },
    setAxisCc: (state, action: PayloadAction<AxisPayload<number>>) => {
      state[action.payload.axis].cc = toMidiValue(action.payload.value)
    },
    setAxisMin: (state, action: PayloadAction<AxisPayload<number>>) => {
      state[action.payload.axis].min = toMidiValue(action.payload.value)
    },
    setAxisMax: (state, action: PayloadAction<AxisPayload<number>>) => {
      state[action.payload.axis].max = toMidiValue(action.payload.value)
    },
    setAxisSize: (state, action: PayloadAction<AxisPayload<number>>) => {
      const { axis, value } = action.payload
      state[axis].sizePercent = clamp(value, sizes[0], sizes[sizes.length - 1])
    },
    setPadValue: (state, action: PayloadAction<Record<CcAxis, number | null>>) => {
      state.value = action.payload
    },
  },
  extraReducers: (builder) => {
    // Switching the backend off means we no longer know what the receiver holds, so the next
    // pointer move must send even if it lands on the same value.
    builder.addCase(setMidiOutput, (state) => {
      state.value = noValue
    })
  },
})

export const selectCcPad = (state: RootState) => state.ccPad
export const selectCcPadAxes = createSelector(selectCcPad, ({ x, y }) => ({ x, y }))
export const selectCcPadValue = createSelector(selectCcPad, ({ value }) => value)

export const { setAxisEnabled, setAxisCc, setAxisMin, setAxisMax, setAxisSize, setPadValue } =
  ccPadSlice.actions
export default ccPadSlice.reducer
