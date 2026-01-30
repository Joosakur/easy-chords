import { call, put, select, takeLatest } from 'redux-saga/effects'
import api from '../../api/http-client'
import type { ChordMapDefinitionV1, ChordV1 } from '../../types'
import { getAbsoluteNotes } from '../../utils/music/chords'
import { parseChordMapJson } from '../../utils/validation/chord-map-schema'
import { playChord } from '../piano/piano-saga-actions'
import { chordClicked, importChordMap, loadChordMap } from './chord-map-saga-actions'
import {
  type EditMode,
  selectActiveChord,
  selectActiveChordIndex,
  selectChords,
  selectEditMode,
  setActiveChordIndex,
  setChord,
  setChords,
  setEditMode,
} from './chord-map-slice'

export function* chordClickedSaga(action: ReturnType<typeof chordClicked>) {
  const {
    payload: { index, x },
  } = action

  const editMode: EditMode = yield select(selectEditMode)

  if (editMode === null) {
    const chord: ChordV1 | null = (yield select(selectChords))[index]
    if (chord) {
      // Velocity based on horizontal click position (0-1) for expressive dynamics
      const velocity = 50 + x * 60
      yield put(
        playChord({
          notes: getAbsoluteNotes(chord).map((note) => ({
            note,
            velocity: velocity + Math.floor(Math.random() * 7),
          })),
        }),
      )
    }
    yield put(setActiveChordIndex(index))
  } else {
    const activeChord: ChordV1 | null = yield select(selectActiveChord)
    const activeChordIndex: number | null = yield select(selectActiveChordIndex)

    if (activeChordIndex === null) return

    if (editMode === 'copy') {
      yield put(setChord({ chord: activeChord, index }))
      yield put(setEditMode(null))
    } else if (editMode === 'swap') {
      const chord2: ChordV1 | null = (yield select(selectChords))[index]
      yield put(setChord({ chord: activeChord, index }))
      yield put(setChord({ chord: chord2, index: activeChordIndex }))
      yield put(setEditMode(null))
    }
  }
}

export function* loadChordMapSaga(action: ReturnType<typeof loadChordMap>) {
  try {
    const chordMap: ChordMapDefinitionV1 = yield call(api.getChordMapPreset, action.payload)
    yield put(setChords(chordMap.chords))
  } catch (e) {
    console.warn('loading preset failed', e)
  }
}

export function* importChordMapSaga(action: ReturnType<typeof importChordMap>) {
  yield put(setActiveChordIndex(null))

  const result = parseChordMapJson(action.payload)

  if (result.success) {
    yield put(setChords(result.data.chords))
  } else {
    alert(`Failed to import chord map:\n${result.error}`)
  }
}

function* chordMapSaga() {
  yield takeLatest(chordClicked, chordClickedSaga)
  yield takeLatest(loadChordMap, loadChordMapSaga)
  yield takeLatest(importChordMap, importChordMapSaga)
}

export default chordMapSaga
