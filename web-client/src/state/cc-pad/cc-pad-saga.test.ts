import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { describe, it } from 'vitest'
import api from '../../api/http-client'
import { selectIsUsingMidi } from '../settings/settings-slice'
import { emitCcSaga } from './cc-pad-saga'
import { initialCcPadState, selectCcPadAxes, selectCcPadValue, setPadValue } from './cc-pad-slice'

const axes = { x: initialCcPadState.x, y: initialCcPadState.y }
const nothingSentYet = { x: null, y: null }

describe('emitCcSaga', () => {
  it('sends the mapped value for both axes', async () => {
    await expectSaga(emitCcSaga, { xRatio: 0, yRatio: 1 })
      .provide([
        [select(selectCcPadAxes), axes],
        [select(selectCcPadValue), nothingSentYet],
        [select(selectIsUsingMidi), true],
        [matchers.call.fn(api.sendCC), undefined],
      ])
      .put(setPadValue({ x: 0, y: 127 }))
      .call(api.sendCC, { channel: 0, cc: 1, value: 0 })
      .call(api.sendCC, { channel: 0, cc: 11, value: 127 })
      .run()
  })

  it('scales to the narrowed range of an axis', async () => {
    await expectSaga(emitCcSaga, { xRatio: 0.5, yRatio: 0.5 })
      .provide([
        [select(selectCcPadAxes), { x: axes.x, y: { ...axes.y, min: 40, max: 80 } }],
        [select(selectCcPadValue), nothingSentYet],
        [select(selectIsUsingMidi), true],
        [matchers.call.fn(api.sendCC), undefined],
      ])
      .call(api.sendCC, { channel: 0, cc: 11, value: 60 })
      .run()
  })

  it('reports no value and sends nothing on a disabled axis', async () => {
    await expectSaga(emitCcSaga, { xRatio: 1, yRatio: 1 })
      .provide([
        [select(selectCcPadAxes), { x: axes.x, y: { ...axes.y, enabled: false } }],
        [select(selectCcPadValue), nothingSentYet],
        [select(selectIsUsingMidi), true],
        [matchers.call.fn(api.sendCC), undefined],
      ])
      .put(setPadValue({ x: 127, y: null }))
      .call(api.sendCC, { channel: 0, cc: 1, value: 127 })
      .not.call(api.sendCC, { channel: 0, cc: 11, value: 127 })
      .run()
  })

  it('does not resend a value that has not changed', async () => {
    await expectSaga(emitCcSaga, { xRatio: 1, yRatio: 0.5 })
      .provide([
        [select(selectCcPadAxes), axes],
        [select(selectCcPadValue), { x: 127, y: null }],
        [select(selectIsUsingMidi), true],
        [matchers.call.fn(api.sendCC), undefined],
      ])
      .not.call(api.sendCC, { channel: 0, cc: 1, value: 127 })
      .call(api.sendCC, { channel: 0, cc: 11, value: 64 })
      .run()
  })

  it('still shows the value but sends nothing without MIDI output', async () => {
    await expectSaga(emitCcSaga, { xRatio: 1, yRatio: 1 })
      .provide([
        [select(selectCcPadAxes), axes],
        [select(selectCcPadValue), nothingSentYet],
        [select(selectIsUsingMidi), false],
      ])
      .put(setPadValue({ x: 127, y: 127 }))
      .not.call.fn(api.sendCC)
      .run()
  })
})
