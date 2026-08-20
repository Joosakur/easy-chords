# State Management

EasyChords uses Redux Toolkit for state management and Redux-Saga for side effects.

## State Structure

```typescript
interface RootState {
  settings: SettingsState
  ui: UIState
  chordMap: ChordMapState
  piano: PianoState
  ccPad: CcPadState
}
```

## Slices

### settings

Manages MIDI output configuration.

```typescript
interface SettingsState {
  midiOutput: boolean          // Whether MIDI output is enabled
  host: string                 // MIDI server hostname (default: "localhost")
  midiDevices: MidiDevice[]    // Available MIDI devices from server
  midiDeviceIndex: number      // Currently selected device index
  transpose: number            // Global semitone offset (-24..24, default 0)
}
```

**Key selector:** `selectIsUsingMidi` - Returns true only when MIDI is enabled AND a valid device is selected. Used throughout the app to decide between MIDI output and Web Audio fallback.

**Transpose:** the UI dispatches `transposeChanged`, not `setTranspose` directly. `transposeChangedSaga`
releases any sounding notes before the offset changes, so note-offs match the note-ons that were sent.
See [audio-output.md](audio-output.md#transpose).

### ui

Controls sidebar visibility.

```typescript
interface UIState {
  settingsOpen: boolean   // Right sidebar (settings panel)
  editorOpen: boolean     // Left sidebar (chord editor)
  ccPadOpen: boolean      // CC pad, which replaces the chord grid and piano
}
```

The `editorOpen` state also affects piano behavior: when true, clicking keys edits the active chord's voicing instead of just playing notes.

`toggleCcPad` closes the editor when the pad opens - the editor edits the chord grid, which the pad hides.

### chordMap

Manages the chord grid and editing operations.

```typescript
interface ChordMapState {
  chords: (ChordV1 | null)[]   // 7 columns, variable rows (length divisible by 7)
  activeChordIndex: number     // Currently selected chord slot
  editMode: 'copy' | 'swap' | null
}
```

**Edit modes:**
- `null` - Normal mode: clicking a chord plays it and selects it
- `'copy'` - Copy mode: next click copies the active chord to that slot
- `'swap'` - Swap mode: next click swaps the active chord with that slot

**Default chords:** The first row is pre-populated with C major diatonic triads (C, Dm, Em, F, G, Am, Bdim).

### ccPad

Per-axis configuration for the 2D Control Change controller, plus the last values sent.

```typescript
interface CcAxisState {
  enabled: boolean
  cc: number          // CC number 0-127
  min: number         // Value at the left / bottom edge
  max: number         // Value at the right / top edge; may be below min, which inverts the axis
  sizePercent: number // Pad size along this axis, 25-100
}

interface CcPadState {
  x: CcAxisState
  y: CcAxisState
  value: { x: number | null; y: number | null }  // null while nothing has been sent
}
```

`value` is what the receiver is believed to hold, and the saga skips sending a value that matches
it. It is cleared when MIDI output is switched off, since the receiver's state is then unknown, and
a disabled axis reports `null` rather than a value it never sent. See
[audio-output.md](audio-output.md#cc-pad).

### piano

Tracks currently playing notes and sustain pedal state.

```typescript
interface PianoState {
  keysDown: number[]      // MIDI note numbers currently pressed
  sustainPedal: boolean   // Sustain pedal state (Space bar)
}
```

## Sagas (Side Effects)

### pianoSaga

Handles note playback and the interaction between piano keys and chord editing.

| Action | Behavior |
|--------|----------|
| `pianoKeyClicked` | If editor open: toggle note in active chord's voicing. Otherwise: play the note. |
| `playNote` | Send note to MIDI server or Web Audio synth |
| `playChord` | Stop previous notes, play new chord notes |
| `stopNotes` | Release all currently held notes |
| `setSustainPedal` | Send MIDI CC#64 (sustain pedal) |

**Piano click with editor open:**
1. Adjusts chord's base octave if needed (keeps voicing values non-negative)
2. Toggles the clicked note in the voicing array
3. Re-normalizes octave (removes empty octaves at start)
4. Recalculates chord name

### chordMapSaga

Handles chord grid interactions and preset loading.

| Action | Behavior |
|--------|----------|
| `chordClicked` | Normal: play chord and select it. Edit mode: copy or swap. |
| `loadChordMap` | Fetch preset from server and replace all chords |
| `importChordMap` | Parse JSON string and replace all chords |

**Velocity calculation:** When clicking a chord button, velocity is based on horizontal click position (`50 + x * 60`) plus random variation (±7), creating expressive dynamics.

### ccPadSaga

Emits Control Change messages as the pointer moves across the CC pad.

| Action | Behavior |
|--------|----------|
| `padPointerMoved` | Maps the 0-1 pointer position onto each axis' range and sends CC for enabled axes whose value changed |

Unlike every other saga here it does **not** use `takeLatest`, which would cancel the saga but not
the HTTP request already in flight, letting values arrive out of order. It serialises the pointer
stream through an `actionChannel` with a sliding buffer of one instead - see
[audio-output.md](audio-output.md#why-the-pad-does-not-use-takelatest).

### settingsSaga

Handles MIDI device discovery.

| Action | Behavior |
|--------|----------|
| `getMidiDevices` | Fetch available devices from MIDI server |
| `chooseMidiDevice` | Select a device by index |

## Data Flow Examples

### Playing a chord from the grid

1. User clicks chord button
2. `chordClicked` action dispatched with index and x-position
3. `chordClickedSaga` checks edit mode
4. If normal mode: dispatches `playChord` with calculated velocities
5. `playChordSaga` checks `selectIsUsingMidi`
6. Either calls MIDI API or Web Audio synth
7. Updates `keysDown` state for visual feedback

### Editing a chord via piano

1. User opens editor (left sidebar)
2. User clicks a chord button to select it
3. User clicks piano keys
4. `pianoKeyClickedSaga` detects editor is open
5. Toggles the note in the active chord's voicing
6. Dispatches `setChord` with updated voicing and recalculated name
