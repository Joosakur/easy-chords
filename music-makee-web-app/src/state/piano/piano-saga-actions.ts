import {createAction} from '@reduxjs/toolkit'

export interface PlayableNote {
  note: number
  velocity: number
}

export interface PlayableChord {
  notes: PlayableNote[]
}

export const pianoKeyClicked = createAction(
  'piano/keyClicked',
  (note: number) => ({payload: note})
)

export const playNote = createAction(
  'piano/playNote',
  (note: PlayableNote) => ({payload: note})
)

export const playChord = createAction(
  'piano/playChord',
  (chord?: PlayableChord) => ({payload: chord})
)

export const stopNotes = createAction('piano/stopNotes')

export const setSustainPedal = createAction(
  'piano/sustainPedal',
  (down: boolean) => ({payload: down})
)
