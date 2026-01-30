/**
 * Music theory utilities for chord manipulation and naming.
 *
 * Key concepts:
 * - Voicing: Array of semitone intervals from root, used for storage and playback.
 *   Values can exceed 11 to span multiple octaves (e.g., 16 = octave + major 3rd).
 * - GridVoicing: 7-element array for the VoicingEditor UI. Each element is an
 *   interval (0-11) or null. Null values represent octave boundaries.
 *
 * @module utils/music/chords
 */

import type { ChordV1, GridVoicing, IntervalNumber, Voicing } from '../../types'

const setsEqual = <T>(a: Set<T>, b: Set<T>): boolean =>
  a.size === b.size && [...a].every((v) => b.has(v))

export const getAbsoluteNotes = (chord: ChordV1): number[] => {
  const { root, voicing, octave } = chord
  return voicing.map((v) => root + v + 12 * octave)
}

/**
 * Converts a Voicing to GridVoicing for display in the VoicingEditor.
 *
 * Inserts null entries when consecutive notes span more than one octave,
 * representing empty columns in the editor grid.
 *
 * @example
 * voicingToGridVoicing([0, 7, 16]) // [0, 7, null, 4]
 * // 0 and 7 are in same octave, 16 is in next octave (16 % 12 = 4)
 */
export const voicingToGridVoicing = (voicing: Voicing): GridVoicing => {
  const gridVoicing: GridVoicing = []

  let prevNote: number | null = null
  for (const note of voicing) {
    const interval = note % 12

    if (prevNote === null) {
      let n = note
      while (n >= 12) {
        gridVoicing.push(null)
        n -= 12
      }
    } else {
      let n = note
      while (n - prevNote > 12) {
        gridVoicing.push(null)
        n -= 12
      }
    }

    gridVoicing.push(interval as IntervalNumber)
    prevNote = note
  }

  console.debug('V-to-GV', voicing, gridVoicing)
  return gridVoicing
}

/**
 * Converts a GridVoicing back to a Voicing for storage and playback.
 *
 * Null entries add 12 semitones (one octave). Non-null entries find the
 * next note that matches the given interval, ensuring notes always ascend.
 *
 * @example
 * gridVoicingToVoicing([0, 7, null, 4]) // [0, 7, 16]
 */
export const gridVoicingToVoicing = (gridVoicing: GridVoicing): Voicing => {
  const voicing: Voicing = []

  let note: number = 0
  let first: boolean = true
  for (const interval of gridVoicing) {
    if (interval === null) {
      note += 12
    } else {
      if (!first) note++
      while (note % 12 !== interval) note++
      voicing.push(note)
      first = false
    }
  }

  console.debug('GV-to-V', gridVoicing, voicing)
  return voicing
}

/**
 * Generates a chord name from root and voicing.
 *
 * The name consists of: root note + quality + optional slash bass.
 * Quality is determined by matching the set of intervals (mod 12) against
 * known chord types. If the lowest note is not the root, a slash notation
 * is added (e.g., "Am7 / C" for Am7 with C in the bass).
 *
 * Returns "?" for the quality if no match is found.
 */
export const getChordName = (root: IntervalNumber, voicing: Voicing) => {
  const rootName = rootNames[root]

  const voices = new Set(voicing.filter((v) => v !== null).map((v) => v % 12))
  const qualityName = qualityNames.find((q) => setsEqual(voices, q.voices))?.name ?? '?'
  const firstVoice = voicing.find((v) => v !== null)
  const bass = firstVoice ? rootNames[(root + firstVoice) % 12] : rootName

  return `${rootName}${qualityName}${bass !== rootName ? ` / ${bass}` : ''}`
}

/**
 * Chord quality lookup table. Order matters: first match wins.
 * Each entry maps a set of intervals (semitones from root, mod 12) to a quality suffix.
 */
const qualityNames: { voices: Set<IntervalNumber>; name: string }[] = [
  { voices: new Set<IntervalNumber>([0, 2, 7]), name: 'sus2' },
  { voices: new Set<IntervalNumber>([0, 3, 6]), name: 'dim' },
  { voices: new Set<IntervalNumber>([0, 3, 7]), name: 'm' },
  { voices: new Set<IntervalNumber>([0, 4, 7]), name: '' },
  { voices: new Set<IntervalNumber>([0, 4, 8]), name: 'aug' },
  { voices: new Set<IntervalNumber>([0, 5, 7]), name: 'sus4' },

  { voices: new Set<IntervalNumber>([0, 3, 6, 9]), name: 'dim7' },
  { voices: new Set<IntervalNumber>([0, 3, 7, 10]), name: 'm7' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 10]), name: '7' },
  { voices: new Set<IntervalNumber>([0, 4, 8, 10]), name: 'aug7' },

  { voices: new Set<IntervalNumber>([0, 3, 6, 10]), name: 'm7b5' },
  { voices: new Set<IntervalNumber>([0, 3, 7, 11]), name: 'mmaj7' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 11]), name: 'maj7' },
  { voices: new Set<IntervalNumber>([0, 4, 8, 11]), name: 'aug maj7' },

  { voices: new Set<IntervalNumber>([0, 3, 7, 10, 2]), name: 'm9' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 10, 2]), name: '9' },
  { voices: new Set<IntervalNumber>([0, 3, 7, 11, 2]), name: 'mmaj9' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 11, 2]), name: 'maj9' },

  { voices: new Set<IntervalNumber>([0, 3, 7, 10, 2, 5]), name: 'm11' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 10, 2, 5]), name: '11' },
  { voices: new Set<IntervalNumber>([0, 3, 7, 11, 2, 5]), name: 'mmaj11' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 11, 2, 5]), name: 'maj11' },

  { voices: new Set<IntervalNumber>([0, 3, 7, 10, 2, 5, 9]), name: 'm13' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 10, 2, 5, 9]), name: '13' },
  { voices: new Set<IntervalNumber>([0, 3, 7, 11, 2, 5, 9]), name: 'mmaj13' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 11, 2, 5, 9]), name: 'maj13' },

  { voices: new Set<IntervalNumber>([0, 3, 7, 2]), name: 'm add9' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 2]), name: ' add9' },

  { voices: new Set<IntervalNumber>([0, 3, 7, 5]), name: 'm add11' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 5]), name: ' add11' },

  { voices: new Set<IntervalNumber>([0, 3, 7, 2, 5]), name: 'm add9add11' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 2, 5]), name: ' add9add11' },

  { voices: new Set<IntervalNumber>([0, 3, 7, 9]), name: 'm6' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 9]), name: '6' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 9, 2]), name: '6/9' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 9, 5]), name: '6/11' },
  { voices: new Set<IntervalNumber>([0, 4, 7, 9, 2, 5]), name: '6/9/11' },
]

/** Note names indexed by semitone (0=C, 1=Db, ... 11=B). Uses flats except for F#. */
const rootNames: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
