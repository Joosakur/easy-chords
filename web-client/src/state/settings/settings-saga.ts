import { call, put, select, takeLatest } from 'redux-saga/effects'
import api, { type MidiDevice } from '../../api/http-client'
import { chooseMidiDevice, getMidiDevices } from './settings-saga-actions'
import { type SettingsState, selectSettings, setHost, setMidiOutput } from './settings-slice'

function* getMidiDevicesSaga() {
  try {
    const devices: MidiDevice[] = yield call(api.getDevices)
    yield put(getMidiDevices.fulfilled(devices))
  } catch (_e) {
    yield put(getMidiDevices.rejected())
  }
}

function* chooseMidiDeviceSaga(action: ReturnType<typeof chooseMidiDevice.requested>) {
  try {
    const index = action.payload
    const settings: SettingsState = yield select(selectSettings)
    const { midiDevices, midiOutput } = settings
    if (!midiOutput || !midiDevices || midiDevices.length < index + 1) return

    const device = midiDevices[index]
    yield call(api.setDevice, device)
    yield put(chooseMidiDevice.fulfilled(index))
  } catch (_e) {
    yield put(chooseMidiDevice.rejected())
  }
}

function* setHostSaga(action: ReturnType<typeof setHost>) {
  api.setHostName(action.payload)
  yield put(getMidiDevices.requested())
}

function* setMidiOutputSaga(action: ReturnType<typeof setMidiOutput>) {
  if (action.payload) {
    yield put(getMidiDevices.requested())
  }
}

function* settingsSaga() {
  yield takeLatest(getMidiDevices.requested, getMidiDevicesSaga)
  yield takeLatest(chooseMidiDevice.requested, chooseMidiDeviceSaga)
  yield takeLatest(setHost, setHostSaga)
  yield takeLatest(setMidiOutput, setMidiOutputSaga)
}

export default settingsSaga
