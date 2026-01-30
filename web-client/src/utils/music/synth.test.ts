import { describe, expect, it } from 'vitest'
import { numberToTone, type Tone } from './synth'

describe('synth', () => {
  describe('numberToTone', () => {
    it('converts MIDI note 0 to C', () => {
      expect(numberToTone(0)).toBe('C')
    })

    it('converts MIDI note 1 to C#', () => {
      expect(numberToTone(1)).toBe('C#')
    })

    it('converts MIDI note 2 to D', () => {
      expect(numberToTone(2)).toBe('D')
    })

    it('converts MIDI note 3 to D#', () => {
      expect(numberToTone(3)).toBe('D#')
    })

    it('converts MIDI note 4 to E', () => {
      expect(numberToTone(4)).toBe('E')
    })

    it('converts MIDI note 5 to F', () => {
      expect(numberToTone(5)).toBe('F')
    })

    it('converts MIDI note 6 to F#', () => {
      expect(numberToTone(6)).toBe('F#')
    })

    it('converts MIDI note 7 to G', () => {
      expect(numberToTone(7)).toBe('G')
    })

    it('converts MIDI note 8 to G#', () => {
      expect(numberToTone(8)).toBe('G#')
    })

    it('converts MIDI note 9 to A', () => {
      expect(numberToTone(9)).toBe('A')
    })

    it('converts MIDI note 10 to A#', () => {
      expect(numberToTone(10)).toBe('A#')
    })

    it('converts MIDI note 11 to B', () => {
      expect(numberToTone(11)).toBe('B')
    })

    it('wraps around for notes >= 12', () => {
      expect(numberToTone(12)).toBe('C')
      expect(numberToTone(13)).toBe('C#')
      expect(numberToTone(24)).toBe('C')
    })

    it('handles middle C (MIDI 60)', () => {
      // MIDI 60 = C4, 60 % 12 = 0 = C
      expect(numberToTone(60)).toBe('C')
    })

    it('handles A440 (MIDI 69)', () => {
      // MIDI 69 = A4, 69 % 12 = 9 = A
      expect(numberToTone(69)).toBe('A')
    })

    it('handles high notes (MIDI 127)', () => {
      // 127 % 12 = 7 = G
      expect(numberToTone(127)).toBe('G')
    })

    it('maps all 12 tones correctly', () => {
      const expected: Tone[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      for (let i = 0; i < 12; i++) {
        expect(numberToTone(i)).toBe(expected[i])
      }
    })

    it('is consistent across octaves', () => {
      for (let octave = 0; octave < 10; octave++) {
        expect(numberToTone(octave * 12)).toBe('C')
        expect(numberToTone(octave * 12 + 4)).toBe('E')
        expect(numberToTone(octave * 12 + 7)).toBe('G')
      }
    })
  })
})
