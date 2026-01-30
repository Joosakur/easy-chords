/**
 * Application-wide constants
 */

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: '650px',
  md: '800px',
  lg: '1200px',
  xl: '1600px',
} as const

// MIDI configuration
export const MIDI = {
  CHANNEL: 1,
  CC: {
    SUSTAIN: 64,
  },
  VALUES: {
    ON: 127,
    OFF: 0,
  },
} as const

// Piano display configuration
export const PIANO = {
  MIN_WIDTH: 400,
  OCTAVE_WIDTH_ESTIMATE: 350,
  MAX_OCTAVES: 7,
} as const

// Piano key layout (music theory constants)
export const PIANO_KEYS = {
  /** Intervals that correspond to white keys (C, D, E, F, G, A, B) */
  WHITE_KEY_INTERVALS: [0, 2, 4, 5, 7, 9, 11] as const,
  /** Position adjustments for black keys to align them properly between white keys */
  BLACK_KEY_POSITION_ADJUSTMENTS: [0, -1, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0] as const,
  /** Black to white key width ratio (percentage) */
  BLACK_WHITE_WIDTH_RATIO: 55,
} as const
