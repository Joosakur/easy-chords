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
    it('calculates MIDI note numbers for C major triad in octave 4', () => {
      const chord: ChordV1 = {
        name: 'C',
        root: 0,
        octave: 4,
        voicing: [0, 4, 7],
      }
      // C4=48, E4=52, G4=55
      expect(getAbsoluteNotes(chord)).toEqual([48, 52, 55])
    })

    it('calculates notes for different root (A)', () => {
      const chord: ChordV1 = {
        name: 'Am',
        root: 9,
        octave: 4,
        voicing: [0, 3, 7],
      }
      // A4=57, C5=60, E5=64
      expect(getAbsoluteNotes(chord)).toEqual([57, 60, 64])
    })

    it('calculates notes for different octave', () => {
      const chord: ChordV1 = {
        name: 'C',
        root: 0,
        octave: 3,
        voicing: [0, 4, 7],
      }
      // C3=36, E3=40, G3=43
      expect(getAbsoluteNotes(chord)).toEqual([36, 40, 43])
    })

    it('handles voicings that span multiple octaves', () => {
      const chord: ChordV1 = {
        name: 'C',
        root: 0,
        octave: 4,
        voicing: [0, 7, 16, 24],
      }
      // C4=48, G4=55, E5=64, C6=72
      expect(getAbsoluteNotes(chord)).toEqual([48, 55, 64, 72])
    })

    it('handles single note voicing', () => {
      const chord: ChordV1 = {
        name: 'C',
        root: 0,
        octave: 4,
        voicing: [0],
      }
      expect(getAbsoluteNotes(chord)).toEqual([48])
    })

    it('handles empty voicing', () => {
      const chord: ChordV1 = {
        name: 'C',
        root: 0,
        octave: 4,
        voicing: [],
      }
      expect(getAbsoluteNotes(chord)).toEqual([])
    })

    it('handles sharp root (F#)', () => {
      const chord: ChordV1 = {
        name: 'F#',
        root: 6,
        octave: 4,
        voicing: [0, 4, 7],
      }
      // F#4=54, A#4=58, C#5=61
      expect(getAbsoluteNotes(chord)).toEqual([54, 58, 61])
    })
  })

  describe('voicingToGridVoicing', () => {
    it('converts a simple voicing within one octave', () => {
      const voicing = [0, 4, 7]
      expect(voicingToGridVoicing(voicing)).toEqual([0, 4, 7])
    })

    it('does not insert null when notes are within same octave span', () => {
      // Gap of 9 semitones (<= 12) - no null needed
      const voicing = [0, 7, 16]
      expect(voicingToGridVoicing(voicing)).toEqual([0, 7, 4])
    })

    it('inserts null when gap exceeds one octave', () => {
      // Gap of 13 semitones (> 12) triggers null insertion
      const voicing = [0, 7, 20]
      expect(voicingToGridVoicing(voicing)).toEqual([0, 7, null, 8])
    })

    it('inserts null at start when first note is in higher octave', () => {
      // First note is 12 or higher
      const voicing = [12, 16, 19]
      expect(voicingToGridVoicing(voicing)).toEqual([null, 0, 4, 7])
    })

    it('inserts multiple nulls at start for very high first note', () => {
      const voicing = [24, 28, 31]
      expect(voicingToGridVoicing(voicing)).toEqual([null, null, 0, 4, 7])
    })

    it('inserts multiple nulls for large gaps', () => {
      // Gap of 25 semitones (> 24) should insert 2 nulls
      const voicing = [0, 25]
      expect(voicingToGridVoicing(voicing)).toEqual([0, null, null, 1])
    })

    it('handles empty voicing', () => {
      expect(voicingToGridVoicing([])).toEqual([])
    })

    it('handles single note voicing', () => {
      expect(voicingToGridVoicing([7])).toEqual([7])
    })

    it('handles single note in higher octave', () => {
      expect(voicingToGridVoicing([19])).toEqual([null, 7])
    })
  })

  describe('gridVoicingToVoicing', () => {
    it('converts a simple grid voicing', () => {
      const gridVoicing: (IntervalNumber | null)[] = [0, 4, 7]
      expect(gridVoicingToVoicing(gridVoicing)).toEqual([0, 4, 7])
    })

    it('handles null entries as octave markers', () => {
      const gridVoicing: (IntervalNumber | null)[] = [0, 7, null, 8]
      expect(gridVoicingToVoicing(gridVoicing)).toEqual([0, 7, 20])
    })

    it('handles null at start', () => {
      const gridVoicing: (IntervalNumber | null)[] = [null, 0, 4, 7]
      expect(gridVoicingToVoicing(gridVoicing)).toEqual([12, 16, 19])
    })

    it('handles multiple nulls at start', () => {
      const gridVoicing: (IntervalNumber | null)[] = [null, null, 0, 4, 7]
      expect(gridVoicingToVoicing(gridVoicing)).toEqual([24, 28, 31])
    })

    it('handles empty grid voicing', () => {
      expect(gridVoicingToVoicing([])).toEqual([])
    })

    it('handles only nulls', () => {
      const gridVoicing: (IntervalNumber | null)[] = [null, null]
      expect(gridVoicingToVoicing(gridVoicing)).toEqual([])
    })

    it('ensures ascending notes even when intervals decrease', () => {
      // Grid: [7, 4] means find 7, then find next 4 (which is higher)
      const gridVoicing: (IntervalNumber | null)[] = [7, 4]
      const result = gridVoicingToVoicing(gridVoicing)
      expect(result).toEqual([7, 16])
      expect(result[1]).toBeGreaterThan(result[0])
    })
  })

  describe('voicing round-trips', () => {
    it('round-trips simple voicing', () => {
      const original = [0, 4, 7]
      const grid = voicingToGridVoicing(original)
      const result = gridVoicingToVoicing(grid)
      expect(result).toEqual(original)
    })

    it('round-trips voicing spanning octaves', () => {
      const original = [0, 7, 16, 24]
      const grid = voicingToGridVoicing(original)
      const result = gridVoicingToVoicing(grid)
      expect(result).toEqual(original)
    })

    it('round-trips voicing with large gap', () => {
      const original = [0, 7, 20]
      const grid = voicingToGridVoicing(original)
      const result = gridVoicingToVoicing(grid)
      expect(result).toEqual(original)
    })

    it('round-trips voicing starting in higher octave', () => {
      const original = [12, 16, 19]
      const grid = voicingToGridVoicing(original)
      const result = gridVoicingToVoicing(grid)
      expect(result).toEqual(original)
    })
  })

  describe('getChordName', () => {
    describe('triads', () => {
      it('returns correct name for major triad', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7])).toBe('C')
      })

      it('returns correct name for minor triad', () => {
        expect(getChordName(9 as IntervalNumber, [0, 3, 7])).toBe('Am')
      })

      it('returns correct name for diminished triad', () => {
        expect(getChordName(11 as IntervalNumber, [0, 3, 6])).toBe('Bdim')
      })

      it('returns correct name for augmented triad', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 8])).toBe('Caug')
      })

      it('returns correct name for sus2', () => {
        expect(getChordName(0 as IntervalNumber, [0, 2, 7])).toBe('Csus2')
      })

      it('returns correct name for sus4', () => {
        expect(getChordName(0 as IntervalNumber, [0, 5, 7])).toBe('Csus4')
      })
    })

    describe('seventh chords', () => {
      it('returns correct name for dominant 7', () => {
        expect(getChordName(7 as IntervalNumber, [0, 4, 7, 10])).toBe('G7')
      })

      it('returns correct name for major 7', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 11])).toBe('Cmaj7')
      })

      it('returns correct name for minor 7', () => {
        expect(getChordName(2 as IntervalNumber, [0, 3, 7, 10])).toBe('Dm7')
      })

      it('returns correct name for diminished 7', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 6, 9])).toBe('Cdim7')
      })

      it('returns correct name for half-diminished (m7b5)', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 6, 10])).toBe('Cm7b5')
      })

      it('returns correct name for minor-major 7', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 11])).toBe('Cmmaj7')
      })

      it('returns correct name for augmented 7', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 8, 10])).toBe('Caug7')
      })

      it('returns correct name for augmented major 7', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 8, 11])).toBe('Caug maj7')
      })
    })

    describe('extended chords', () => {
      it('returns correct name for dominant 9', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 10, 14])).toBe('C9')
      })

      it('returns correct name for major 9', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 11, 14])).toBe('Cmaj9')
      })

      it('returns correct name for minor 9', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 10, 14])).toBe('Cm9')
      })

      it('returns correct name for minor-major 9', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 11, 14])).toBe('Cmmaj9')
      })

      it('returns correct name for dominant 11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 10, 14, 17])).toBe('C11')
      })

      it('returns correct name for major 11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 11, 14, 17])).toBe('Cmaj11')
      })

      it('returns correct name for minor 11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 10, 14, 17])).toBe('Cm11')
      })

      it('returns correct name for minor-major 11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 11, 14, 17])).toBe('Cmmaj11')
      })

      it('returns correct name for dominant 13', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 10, 14, 17, 21])).toBe('C13')
      })

      it('returns correct name for major 13', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 11, 14, 17, 21])).toBe('Cmaj13')
      })

      it('returns correct name for minor 13', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 10, 14, 17, 21])).toBe('Cm13')
      })

      it('returns correct name for minor-major 13', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 11, 14, 17, 21])).toBe('Cmmaj13')
      })
    })

    describe('add chords', () => {
      it('returns correct name for add9', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 14])).toBe('C add9')
      })

      it('returns correct name for minor add9', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 14])).toBe('Cm add9')
      })

      it('returns correct name for add11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 17])).toBe('C add11')
      })

      it('returns correct name for minor add11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 17])).toBe('Cm add11')
      })

      it('returns correct name for add9add11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 14, 17])).toBe('C add9add11')
      })

      it('returns correct name for minor add9add11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 14, 17])).toBe('Cm add9add11')
      })
    })

    describe('sixth chords', () => {
      it('returns correct name for major 6', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 9])).toBe('C6')
      })

      it('returns correct name for minor 6', () => {
        expect(getChordName(0 as IntervalNumber, [0, 3, 7, 9])).toBe('Cm6')
      })

      it('returns correct name for 6/9', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 9, 14])).toBe('C6/9')
      })

      it('returns correct name for 6/11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 9, 17])).toBe('C6/11')
      })

      it('returns correct name for 6/9/11', () => {
        expect(getChordName(0 as IntervalNumber, [0, 4, 7, 9, 14, 17])).toBe('C6/9/11')
      })
    })

    describe('different roots', () => {
      it('handles all 12 roots correctly', () => {
        const roots: [IntervalNumber, string][] = [
          [0, 'C'],
          [1, 'Db'],
          [2, 'D'],
          [3, 'Eb'],
          [4, 'E'],
          [5, 'F'],
          [6, 'F#'],
          [7, 'G'],
          [8, 'Ab'],
          [9, 'A'],
          [10, 'Bb'],
          [11, 'B'],
        ]
        for (const [root, name] of roots) {
          expect(getChordName(root, [0, 4, 7])).toBe(name)
        }
      })
    })

    describe('inversions (slash chords)', () => {
      it('adds slash notation for first inversion', () => {
        // C/E - E is in the bass
        expect(getChordName(0 as IntervalNumber, [4, 7, 12])).toBe('C / E')
      })

      it('adds slash notation for second inversion', () => {
        // C/G - G is in the bass
        expect(getChordName(0 as IntervalNumber, [7, 12, 16])).toBe('C / G')
      })

      it('handles minor chord inversions', () => {
        // Am/C - C is in the bass
        expect(getChordName(9 as IntervalNumber, [3, 7, 12])).toBe('Am / C')
      })

      it('handles seventh chord inversions', () => {
        // Cmaj7/E
        expect(getChordName(0 as IntervalNumber, [4, 7, 11, 12])).toBe('Cmaj7 / E')
      })
    })

    describe('unrecognized chords', () => {
      it('returns ? for unrecognized interval set', () => {
        // Random intervals that don't match any known chord
        expect(getChordName(0 as IntervalNumber, [0, 1, 2])).toBe('C?')
      })

      it('returns ? for single note', () => {
        expect(getChordName(0 as IntervalNumber, [0])).toBe('C?')
      })

      it('returns ? for two notes (not a triad)', () => {
        expect(getChordName(0 as IntervalNumber, [0, 7])).toBe('C?')
      })
    })

    describe('voicing octave independence', () => {
      it('recognizes chord regardless of octave placement', () => {
        // Same intervals but spread across octaves
        expect(getChordName(0 as IntervalNumber, [0, 16, 19])).toBe('C')
        expect(getChordName(0 as IntervalNumber, [12, 16, 19])).toBe('C')
      })
    })
  })
})
