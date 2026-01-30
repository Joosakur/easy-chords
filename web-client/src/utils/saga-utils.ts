import { createAction, type PayloadActionCreator } from '@reduxjs/toolkit'

export function createAsyncAction<I, R, E>(
  type: string,
): {
  requested: PayloadActionCreator<I>
  fulfilled: PayloadActionCreator<R>
  rejected: PayloadActionCreator<E>
} {
  return {
    requested: createAction<I>(`${type}/requested`),
    fulfilled: createAction<R>(`${type}/fulfilled`),
    rejected: createAction<E>(`${type}/rejected`),
  }
}
