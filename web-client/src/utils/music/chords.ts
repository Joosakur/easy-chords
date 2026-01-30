import isEqual from 'lodash/isEqual'
import type { ChordV1, GridVoicing, IntervalNumber, Voicing } from '../../types'

export const getAbsoluteNotes = (chord: ChordV1): number[] => {
  const { root, voicing, octave } = chord
  return voicing.map((v) => root + v + 12 * octave)
}

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

export const getChordName = (root: IntervalNumber, voicing: Voicing) => {
  const rootName = rootNames[root]

  const voices = new Set(voicing.filter((v) => v !== null).map((v) => v % 12))
  const qualityName = qualityNames.find((q) => isEqual(voices, q.voices))?.name ?? '?'
  const firstVoice = voicing.find((v) => v !== null)
  const bass = firstVoice ? rootNames[(root + firstVoice) % 12] : rootName

  return `${rootName}${qualityName}${bass !== rootName ? ` / ${bass}` : ''}`
}

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

const rootNames: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
