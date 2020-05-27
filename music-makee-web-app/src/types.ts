export type IntervalNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export type Voicing = number[]

export type GridVoicing = (IntervalNumber | null)[]

export interface ChordV1 {
  name: string
  root: IntervalNumber
  voicing: Voicing
  octave: number
}

export interface ChordMapDefinitionV1 {
  chords: (ChordV1 | null)[]
  version: 1
}
