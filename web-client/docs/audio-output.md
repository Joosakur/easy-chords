# Audio Output System

EasyChords supports two audio backends: MIDI server output and Web Audio synthesis.

## Backend Selection

The active backend is determined by `selectIsUsingMidi`:

```
MIDI enabled AND host configured AND device selected → MIDI Server
Otherwise → Web Audio (fallback)
```

Users configure this in the Settings panel (right sidebar).

## MIDI Server

### Architecture

The application communicates with an external MIDI server via HTTP REST API. The server runs separately and bridges HTTP requests to actual MIDI hardware.

```
[EasyChords Web App] --HTTP--> [MIDI Server :8080] --MIDI--> [Synthesizer/DAW]
```

Default endpoint: `http://localhost:8080`

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/notes` | Play a note (note-on event) |
| DELETE | `/channels/{ch}/notes/{n}` | Stop a note (note-off event) |
| POST | `/chords` | Play/stop multiple notes atomically |
| POST | `/cc` | Send MIDI Control Change message |
| GET | `/devices` | List available MIDI output devices |
| PUT | `/devices` | Select active MIDI output device |

### Event Types

```typescript
// Single note
interface NoteEvent {
  channel: number    // MIDI channel (1-16)
  note: number       // MIDI note number (0-127)
  velocity: number   // Note velocity (0-127)
  duration?: number  // Optional auto-off duration
}

// Control Change (e.g., sustain pedal)
interface CCEvent {
  channel: number
  cc: number         // CC number (64 = sustain pedal)
  value: number      // 0 = off, 127 = on
}

// Chord (batch operation)
interface ChordEvent {
  playNotes: NoteEvent[]      // Notes to start
  stopNotes: NoteEventBasic[] // Notes to stop
}
```

### Why Batch Chord Events?

The `/chords` endpoint accepts both notes to play and notes to stop in a single request. This ensures:
- Previous chord notes are released at the same moment new ones start
- No audible gap between chords
- Atomic operation prevents race conditions

## Web Audio Fallback

When MIDI is disabled or unavailable, the app uses `audiosynth.js` (loaded in `index.html`) for sound generation.

### Implementation

`SynthInstrument` class wraps the audiosynth library:

```typescript
class SynthInstrument {
  playNote(noteNumber: number): void
}
```

**Note number conversion:**
- Tone: `noteNumber % 12` → C, C#, D, ... B
- Octave: `Math.floor(noteNumber / 12) - 1`

**Fixed parameters:**
- Volume: 0.2 (20%)
- Note duration: 2 seconds
- Instrument: Piano

### Limitations

The Web Audio fallback:
- Does not support note-off (notes always play for 2 seconds)
- Does not support velocity dynamics
- Does not support sustain pedal
- Uses a simple piano sound only

It exists primarily for testing and demo purposes when no MIDI setup is available.

## MIDI Note Numbers

The app uses standard MIDI note numbering:

| Note | MIDI Number |
|------|-------------|
| C4 (Middle C) | 60 |
| A4 (Concert pitch) | 69 |

Formula: `MIDI = (octave + 1) * 12 + semitone` where C=0, C#=1, ... B=11

## Transpose

A global semitone offset (`settings.transpose`, -24..24) shifts everything that sounds, on both
backends. It is applied only at the output boundary in `piano-sagas.ts` — inside `playNoteSaga`,
`playChordSaga` and `stopNotesSaga`.

Everything upstream stays in written pitch: `piano.keysDown`, the on-screen key highlight, chord
names, and the voicing editor are untouched. With transpose +2, the pad `C` still reads `C` and still
highlights C-E-G, but a D major chord sounds.

Two rules follow from this:

- Note-offs must carry the same offset as their note-ons. `stopNotes` payloads are built from
  `keysDown`, which holds written notes, so they are transposed on the way out too.
- The offset cannot change while notes are held. `transposeChangedSaga` releases sounding notes
  before applying a new value, otherwise the note-offs would target different pitches than the
  note-ons and MIDI notes would hang.

Notes pushed outside 0-127 are dropped rather than clamped: a clamped note would sound at the wrong
pitch, and both backends reject out-of-range input (the server throws `InvalidMidiDataException`,
and `numberToTone` throws on negatives).

## Sustain Pedal

The Space bar controls the sustain pedal:
- Press: Sends CC#64 value 127 (pedal down)
- Release: Sends CC#64 value 0 (pedal up)

Only works with MIDI output; Web Audio fallback ignores sustain.
