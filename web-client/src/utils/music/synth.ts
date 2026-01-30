declare const Synth: AudioSynth

interface AudioSynth {
  createInstrument: (id: string | number) => Instrument
  setVolume: (vol: number) => void
}

interface Instrument {
  play: (note: Tone, octave: number, seconds: number) => void
}

type Tone = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

Synth.setVolume(0.2)
const defaultLength = 2

const numberToTone = (num: number): Tone => {
  switch (num % 12) {
    case 0:
      return 'C'
    case 1:
      return 'C#'
    case 2:
      return 'D'
    case 3:
      return 'D#'
    case 4:
      return 'E'
    case 5:
      return 'F'
    case 6:
      return 'F#'
    case 7:
      return 'G'
    case 8:
      return 'G#'
    case 9:
      return 'A'
    case 10:
      return 'A#'
    case 11:
      return 'B'
    default:
      throw new Error('Could not parse tone from number')
  }
}

class SynthInstrument {
  private instrument: Instrument

  constructor(instrumentId: string = 'piano') {
    this.instrument = Synth.createInstrument(instrumentId)
  }

  playNote = (noteNumber: number): void => {
    this.instrument.play(numberToTone(noteNumber), Math.floor(noteNumber / 12) - 1, defaultLength)
  }
}

export default SynthInstrument
