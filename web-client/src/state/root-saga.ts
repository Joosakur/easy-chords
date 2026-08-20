import { all } from 'redux-saga/effects'
import ccPadSaga from './cc-pad/cc-pad-saga'
import chordMapSaga from './chord-map/chord-map-sagas'
import pianoSaga from './piano/piano-sagas'
import settingsSaga from './settings/settings-saga'

function* rootSaga() {
  yield all([settingsSaga(), chordMapSaga(), pianoSaga(), ccPadSaga()])
}

export default rootSaga
