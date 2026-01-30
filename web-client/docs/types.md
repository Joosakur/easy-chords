# Data Types and Formats

## Chord Map Format (V1)

Chord maps are stored and exported as JSON files with the `ChordMapDefinitionV1` format.

### Structure

```typescript
interface ChordMapDefinitionV1 {
  version: 1
  chords: (ChordV1 | null)[]  // Array of 35 slots (7 columns x 5 rows)
}

interface ChordV1 {
  name: string           // Display name, e.g., "Cmaj7"
  root: IntervalNumber   // Root note: 0-11 (C=0, C#=1, ... B=11)
  voicing: number[]      // Intervals from root in semitones
  octave: number         // Starting octave for the chord
}

type IntervalNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
```

### Example

```json
{
  "version": 1,
  "chords": [
    {"name": "C", "root": 0, "octave": 4, "voicing": [0, 7, 16, 24]},
    {"name": "Dm", "root": 2, "octave": 4, "voicing": [0, 7, 15, 24]},
    null,
    ...
  ]
}
```

### Backwards Compatibility Notes

- The `version` field must be `1` for current format
- The `chords` array must have exactly 35 elements (nulls for empty slots)
- `voicing` values are **absolute semitone intervals from the root**, not scale degrees
  - Example: `[0, 7, 16, 24]` means root + perfect fifth + major third (octave up) + root (two octaves up)
- The `name` field is for display only; the actual chord is determined by `root` + `voicing`

## Internal Types

### Voicing vs GridVoicing

Two representations of chord voicings exist for different purposes:

**Voicing** (`number[]`)
- Array of semitone intervals from root, used for storage and playback
- Each value is the number of semitones above the root note
- Values can exceed 11 to place notes in higher octaves
- Example: `[0, 7, 16, 24]` means:
  - `0` = root (0 semitones up)
  - `7` = perfect 5th (7 semitones up)
  - `16` = major 3rd one octave up (12 + 4 semitones)
  - `24` = root two octaves up (24 semitones)

The actual MIDI notes are calculated as: `root + interval + (octave * 12)`

**GridVoicing** (`(IntervalNumber | null)[]`)
- 7-element array mapping directly to the VoicingEditor's 7 columns
- Each element is the interval (0-11) selected for that column, or `null`
- `null` values represent octave jumps when converting back to Voicing
- Used only for the VoicingEditor UI

**Conversion** (in `utils/music/chords.ts`):
- The conversion algorithms process notes sequentially to determine where octave boundaries fall
- `null` entries in GridVoicing signal "skip to next octave" during reconstruction
