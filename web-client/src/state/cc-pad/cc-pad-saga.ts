/**
 * Emits MIDI Control Change messages as the pointer moves across the CC pad.
 *
 * Every message is a separate HTTP request, so the pointer stream is serialised through an
 * action channel with a sliding buffer of one: at most one request is in flight, and the buffer
 * always holds the newest position. Intermediate positions are dropped only when the pointer
 * outruns the round trip, which keeps the values in order and the server from being flooded.
 * `takeLatest` would not work here - it cancels the saga but not the request already sent, so
 * values could arrive out of order.
 *
 * @module state/cc-pad/cc-pad-saga
 */

import { buffers } from 'redux-saga'
import { actionChannel, all, call, put, select, take } from 'redux-saga/effects'
import api, { type CCEvent } from '../../api/http-client'
import { MIDI } from '../../config/constants'
import { ratioToCcValue } from '../../utils/music/cc'
import { selectIsUsingMidi } from '../settings/settings-slice'
import type { PadPosition } from './cc-pad-saga-actions'
import { padPointerMoved } from './cc-pad-saga-actions'
import {
  type CcAxis,
  type CcAxisState,
  selectCcPadAxes,
  selectCcPadValue,
  setPadValue,
} from './cc-pad-slice'

export function* emitCcSaga({ xRatio, yRatio }: PadPosition) {
  const axes: Record<CcAxis, CcAxisState> = yield select(selectCcPadAxes)
  const previous: Record<CcAxis, number | null> = yield select(selectCcPadValue)

  // A disabled axis sends nothing, so it reports no value rather than one the receiver never got
  const next: Record<CcAxis, number | null> = {
    x: axes.x.enabled ? ratioToCcValue(xRatio, axes.x.min, axes.x.max) : null,
    y: axes.y.enabled ? ratioToCcValue(yRatio, axes.y.min, axes.y.max) : null,
  }
  yield put(setPadValue(next))

  if (!(yield select(selectIsUsingMidi))) return

  const changed = (['x', 'y'] as const).filter(
    (axis) => next[axis] !== null && next[axis] !== previous[axis],
  )
  const events: CCEvent[] = changed.map((axis) => ({
    channel: MIDI.CHANNEL,
    cc: axes[axis].cc,
    value: next[axis] as number,
  }))

  if (events.length === 0) return

  try {
    yield all(events.map((event) => call(api.sendCC, event)))
  } catch (_e) {
    console.warn('could not send CC')
  }
}

function* ccPadSaga() {
  const channel: unknown = yield actionChannel(padPointerMoved, buffers.sliding(1))

  while (true) {
    const action: ReturnType<typeof padPointerMoved> = yield take(channel as never)
    yield call(emitCcSaga, action.payload)
  }
}

export default ccPadSaga
