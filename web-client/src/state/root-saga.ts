import { all } from 'redux-saga/effects'
import chordMapSaga from './chord-map/chord-map-sagas'
import pianoSaga from './piano/piano-sagas'
import settingsSaga from './settings/settings-saga'

function* rootSaga() {
  yield all([settingsSaga(), chordMapSaga(), pianoSaga()])
}

export default rootSaga
