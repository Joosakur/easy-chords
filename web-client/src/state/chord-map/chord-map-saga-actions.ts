import { createAction } from '@reduxjs/toolkit'

export interface ChordClickEvent {
  index: number
  x: number
  y: number
}

export const chordClicked = createAction('chordMap/chordClicked', (event: ChordClickEvent) => ({
  payload: event,
}))
export const loadChordMap = createAction('chordMap/load', (path: string) => ({ payload: path }))
export const importChordMap = createAction('chordMap/import', (json: string) => ({ payload: json }))
