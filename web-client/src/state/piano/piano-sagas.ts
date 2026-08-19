/**
 * Piano sagas handle note playback and chord editing via piano keys.
 *
 * Key behaviors:
 * - When editor is closed: piano keys simply play notes
 * - When editor is open: piano keys toggle notes in the active chord's voicing
 * - Audio output routes to MIDI server or Web Audio based on settings
 *
 * @module state/piano/piano-sagas
 */

import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import api, { type CCEvent, type ChordEvent, type NoteEvent } from '../../api/http-client'
import { MIDI } from '../../config/constants'
import type { ChordV1 } from '../../types'
import { getAbsoluteNotes, getChordName } from '../../utils/music/chords'
import SynthInstrument from '../../utils/music/synth'
import { selectActiveChord, setChord } from '../chord-map/chord-map-slice'
import { transposeChanged } from '../settings/settings-saga-actions'
import { selectIsUsingMidi, selectTranspose, setTranspose } from '../settings/settings-slice'
import { selectIsEditorOpen } from '../ui/ui-slice'
import {
  pianoKeyClicked,
  playChord,
  playNote,
  setSustainPedal,
  stopNotes,
} from './piano-saga-actions'
import { pianoKeyDown, pianoKeysUp, selectKeysDown } from './piano-slice'

const synth = new SynthInstrument()

const defaultVelocity = 80

const MIDI_NOTE_MIN = 0
const MIDI_NOTE_MAX = 127

/**
 * Applies the global transpose offset. Notes pushed outside the MIDI range are dropped rather
 * than clamped: a clamped note would sound at the wrong pitch, and both backends reject
 * out-of-range input (the server throws, and numberToTone throws on negatives).
 */
const transposeNotes = <T extends { note: number }>(notes: T[], transpose: number): T[] =>
  notes
    .map((n) => ({ ...n, note: n.note + transpose }))
    .filter(({ note }) => note >= MIDI_NOTE_MIN && note <= MIDI_NOTE_MAX)

/**
 * Handles piano key clicks. Behavior depends on editor state:
 *
 * Editor closed: Simply plays the clicked note.
 *
 * Editor open: Toggles the note in the active chord's voicing.
 * - If note is below current root octave, shifts octave down (increases all voicing intervals)
 * - Adds or removes the note from voicing
 * - Normalizes octave (removes empty octaves at start)
 * - Recalculates chord name
 */
export function* pianoKeyClickedSaga({ payload: note }: ReturnType<typeof pianoKeyClicked>) {
  const editorOpen: boolean = yield select(selectIsEditorOpen)
  const activeChord: ChordV1 | null = yield select(selectActiveChord)
  if (editorOpen && activeChord) {
    const newChord = structuredClone(activeChord)

    // adjust root octave if new note is below it
    while (note < 12 * newChord.octave + newChord.root) {
      newChord.octave = newChord.octave - 1
      newChord.voicing = newChord.voicing.map((v) => v + 12)
    }

    // toggle note on/off
    const noteIndex = newChord.voicing.lastIndexOf(
      note - 12 * activeChord.octave - activeChord.root,
    )
    if (noteIndex >= 0) {
      newChord.voicing.splice(noteIndex, 1)
    } else {
      newChord.voicing.push(note - 12 * newChord.octave - newChord.root)
      newChord.voicing.sort((a, b) => a - b)
      yield put(playNote({ note, velocity: defaultVelocity }))
    }

    // get rid of empty octaves at start
    while (newChord.voicing.length > 0 && newChord.voicing[0] >= 12) {
      newChord.octave = newChord.octave + 1
      newChord.voicing = newChord.voicing.map((v) => v - 12)
    }

    newChord.name = getChordName(newChord.root, newChord.voicing)
    yield put(setChord({ chord: newChord }))
  } else {
    yield put(playNote({ note, velocity: defaultVelocity }))
  }
}

export function* playNoteSaga({ payload: { note, velocity } }: ReturnType<typeof playNote>) {
  yield put(pianoKeyDown(note))

  const transpose: number = yield select(selectTranspose)
  const [sounding] = transposeNotes([{ note }], transpose)
  if (!sounding) return

  if (yield select(selectIsUsingMidi)) {
    try {
      const event: NoteEvent = { note: sounding.note, channel: MIDI.CHANNEL, velocity }
      yield call(api.playNote, event)
    } catch (_e) {
      console.warn('could not play the note')
    }
  } else {
    synth.playNote(sounding.note)
  }
}

/**
 * Plays a chord, stopping any previously held notes.
 * If no chord provided, plays the currently active chord from the grid.
 */
export function* playChordSaga({ payload }: ReturnType<typeof playChord>) {
  const previousNotes: number[] = yield select(selectKeysDown)
  yield put(pianoKeysUp())

  let chord = payload
  if (!chord) {
    const activeChord = yield select(selectActiveChord)
    if (activeChord) {
      chord = {
        notes: getAbsoluteNotes(activeChord).map((note) => ({
          note,
          velocity: defaultVelocity,
        })),
      }
    } else {
      return
    }
  }

  for (const { note } of chord.notes) {
    yield put(pianoKeyDown(note))
  }

  const transpose: number = yield select(selectTranspose)
  const soundingNotes = transposeNotes(chord.notes, transpose)

  if (yield select(selectIsUsingMidi)) {
    try {
      const event: ChordEvent = {
        playNotes: soundingNotes.map(({ note, velocity }) => ({
          note,
          channel: MIDI.CHANNEL,
          velocity,
        })),
        stopNotes: transposeNotes(
          previousNotes.map((note) => ({ note })),
          transpose,
        ).map(({ note }) => ({ note, channel: MIDI.CHANNEL })),
      }
      yield call(api.playChord, event)
    } catch (_e) {
      console.warn('could not play the chord')
    }
  } else {
    soundingNotes.forEach(({ note }) => {
      synth.playNote(note)
    })
  }
}

/** Releases all currently held notes (MIDI only; Web Audio notes decay naturally). */
export function* stopNotesSaga() {
  if (yield select(selectIsUsingMidi)) {
    try {
      const keysDown: number[] = yield select(selectKeysDown)
      const transpose: number = yield select(selectTranspose)
      const event: ChordEvent = {
        playNotes: [],
        stopNotes: transposeNotes(
          keysDown.map((note) => ({ note })),
          transpose,
        ).map(({ note }) => ({ note, channel: MIDI.CHANNEL })),
      }
      yield call(api.playChord, event)
    } catch (_e) {
      console.warn('could not stop the notes')
    }
  }

  yield put(pianoKeysUp())
}

/**
 * Stops sounding notes before the offset changes, so note-offs are sent with the same transpose
 * that the note-ons used. Without this, held notes would hang on the MIDI device.
 */
export function* transposeChangedSaga({ payload }: ReturnType<typeof transposeChanged>) {
  yield call(stopNotesSaga)
  yield put(setTranspose(payload))
}

/** Sends sustain pedal CC message. Only works with MIDI output. */
export function* setSustainPedalSaga(action: ReturnType<typeof setSustainPedal>) {
  if (!(yield select(selectIsUsingMidi))) return

  try {
    const event: CCEvent = {
      cc: MIDI.CC.SUSTAIN,
      value: action.payload ? MIDI.VALUES.ON : MIDI.VALUES.OFF,
      channel: MIDI.CHANNEL,
    }
    yield call(api.sendCC, event)
  } catch (_e) {
    console.warn('could not send CC')
  }
}

function* pianoSaga() {
  yield takeLatest(playChord, playChordSaga)
  yield takeEvery(pianoKeyClicked, pianoKeyClickedSaga)
  yield takeEvery(playNote, playNoteSaga)
  yield takeLatest(stopNotes, stopNotesSaga)
  yield takeLatest(setSustainPedal, setSustainPedalSaga)
  yield takeLatest(transposeChanged, transposeChangedSaga)
}

export default pianoSaga
