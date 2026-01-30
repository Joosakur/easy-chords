import { describe, it, expect } from 'vitest'
import {
  getAbsoluteNotes,
  voicingToGridVoicing,
  gridVoicingToVoicing,
  getChordName,
} from './chords'
import type { ChordV1, IntervalNumber } from '../../types'

describe('chords', () => {
  describe('getAbsoluteNotes', () => {
    it('calculates MIDI note numbers for a C major triad in octave 4', () => {
      const chord: ChordV1 = {
        name: 'C',
        root: 0,
        octave: 4,
        voicing: [0, 4, 7],
      }
      expect(getAbsoluteNotes(chord)).toEqual([48, 52, 55])
    })

    it('handles voicings that span multiple octaves', () => {
      const chord: ChordV1 = {
        name: 'C',
        root: 0,
        octave: 4,
        voicing: [0, 7, 16, 24],
      }
      expect(getAbsoluteNotes(chord)).toEqual([48, 55, 64, 72])
    })
  })

  describe('voicingToGridVoicing', () => {
    it('converts a simple voicing within one octave', () => {
      const voicing = [0, 4, 7]
      expect(voicingToGridVoicing(voicing)).toEqual([0, 4, 7])
    })

    it('inserts null when gap exceeds one octave', () => {
      // Gap of 13 semitones (> 12) triggers null insertion
      const voicing = [0, 7, 20]
      expect(voicingToGridVoicing(voicing)).toEqual([0, 7, null, 8])
    })

    it('does not insert null when notes are within same octave span', () => {
      // Gap of 9 semitones (<= 12) - no null needed
      const voicing = [0, 7, 16]
      expect(voicingToGridVoicing(voicing)).toEqual([0, 7, 4])
    })
  })

  describe('gridVoicingToVoicing', () => {
    it('converts a simple grid voicing', () => {
      const gridVoicing: (IntervalNumber | null)[] = [0, 4, 7]
      expect(gridVoicingToVoicing(gridVoicing)).toEqual([0, 4, 7])
    })

    it('handles null entries as octave markers', () => {
      // null adds 12 to running total, then finds next matching interval
      const gridVoicing: (IntervalNumber | null)[] = [0, 7, null, 8]
      expect(gridVoicingToVoicing(gridVoicing)).toEqual([0, 7, 20])
    })
  })

  describe('getChordName', () => {
    it('returns correct name for C major', () => {
      expect(getChordName(0 as IntervalNumber, [0, 4, 7])).toBe('C')
    })

    it('returns correct name for A minor', () => {
      expect(getChordName(9 as IntervalNumber, [0, 3, 7])).toBe('Am')
    })

    it('returns correct name for G7', () => {
      expect(getChordName(7 as IntervalNumber, [0, 4, 7, 10])).toBe('G7')
    })

    it('adds slash notation for inversions', () => {
      expect(getChordName(0 as IntervalNumber, [4, 7, 12])).toBe('C / E')
    })
  })
})
