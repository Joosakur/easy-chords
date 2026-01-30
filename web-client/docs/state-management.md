# State Management

EasyChords uses Redux Toolkit for state management and Redux-Saga for side effects.

## State Structure

```typescript
interface RootState {
  settings: SettingsState
  ui: UIState
  chordMap: ChordMapState
  piano: PianoState
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
}
```

**Key selector:** `selectIsUsingMidi` - Returns true only when MIDI is enabled AND a valid device is selected. Used throughout the app to decide between MIDI output and Web Audio fallback.

### ui

Controls sidebar visibility.

```typescript
interface UIState {
  settingsOpen: boolean   // Right sidebar (settings panel)
  editorOpen: boolean     // Left sidebar (chord editor)
}
```

The `editorOpen` state also affects piano behavior: when true, clicking keys edits the active chord's voicing instead of just playing notes.

### chordMap

Manages the 7x5 chord grid and editing operations.

```typescript
interface ChordMapState {
  chords: (ChordV1 | null)[]   // 35-element array (7 columns x 5 rows)
  activeChordIndex: number     // Currently selected chord slot
  editMode: 'copy' | 'swap' | null
}
```

**Edit modes:**
- `null` - Normal mode: clicking a chord plays it and selects it
- `'copy'` - Copy mode: next click copies the active chord to that slot
- `'swap'` - Swap mode: next click swaps the active chord with that slot

**Default chords:** The first row is pre-populated with C major diatonic triads (C, Dm, Em, F, G, Am, Bdim).

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
