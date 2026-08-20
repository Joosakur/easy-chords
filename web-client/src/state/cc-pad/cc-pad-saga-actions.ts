import { createAction } from '@reduxjs/toolkit'

export interface PadPosition {
  /** 0 at the left edge of the pad, 1 at the right edge */
  xRatio: number
  /** 0 at the bottom edge of the pad, 1 at the top edge */
  yRatio: number
}

export const padPointerMoved = createAction('ccPad/pointerMoved', (position: PadPosition) => ({
  payload: position,
}))
