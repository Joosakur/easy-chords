import { all } from 'redux-saga/effects'
import settingsSaga from './settings/settings-saga'
import chordMapSaga from './chord-map/chord-map-sagas'
import pianoSaga from './piano/piano-sagas'

function* rootSaga() {
  yield all([
    settingsSaga(),
    chordMapSaga(),
    pianoSaga()
  ])
}

export default rootSaga
