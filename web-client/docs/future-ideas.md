# Future Ideas

Scratchpad for potential improvements and features to explore later.

## UX Improvements

### Separate root interpretation from transposition

Currently dragging the root indicator on the piano both changes the root assignment AND transposes the chord (because voicing intervals are relative to root). Users may want to re-interpret a chord's function without changing its sound.

Consider: separate "change root" (reinterpret) vs "transpose" (shift all notes) operations.

### Rethink VoicingEditor grid interface

The 7x12 interval grid is educational but unintuitive for practical voicing construction. Users must think in intervals rather than note names, and column position affecting octave is not obvious.

Consider: piano roll style editor, note-name input, or hybrid approach.

## Technical Improvements

### Research modern Web Audio libraries

The current `audiosynth.js` fallback has significant limitations:
- No note-off support (fixed 2-second duration)
- No velocity sensitivity
- No sustain pedal support
- Single instrument (piano)

Research: Tone.js, Howler.js, or Web Audio API directly for better synthesis options.

## Feature Ideas

### Configurable chord grid size

Currently the chord grid is fixed at 7x5 (35 slots). Users may want:
- Add/remove rows
- Add/remove columns
- Different layouts for different use cases (e.g., 4x4 for simpler songs, larger grids for complex arrangements)

Would require a new `ChordMapDefinitionV2` format for export. Import should support both V1 (migrate to current grid size) and V2.
