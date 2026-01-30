# Chord Editing UX

This document describes the three methods for creating and editing chords in EasyChords.

## Overview

Chords can be edited using three different interfaces, each suited for different workflows:

1. **Root + Quality Selection** - Quick preset-based chord creation
2. **Piano Keyboard** - Visual note-by-note voicing construction
3. **Voicing Editor Grid** - Interval-based voicing arrangement

All three methods modify the same underlying chord data structure and work together.

## Method 1: Root + Quality Selection

**Location:** Left sidebar, top section

### Root Selector (Circle of Fifths)

A circular arrangement of 12 note buttons following the circle of fifths order:
```
C → G → D → A → E → B → F# → Db → Ab → Eb → Bb → F → (back to C)
```

Clicking a note sets it as the chord's root. The selected root determines:
- Which note is considered the "tonic" for naming purposes
- The base pitch from which voicing intervals are calculated

### Quality Selector (3x4 Grid)

A grid of 12 common chord qualities:

| Row 1 | sus2 | aug | sus4 |
|-------|------|-----|------|
| Row 2 | 7 | major | maj7 |
| Row 3 | m7 | minor | m(maj7) |
| Row 4 | dim7 | dim | m7b5 |

Each button applies a predefined voicing (as semitone intervals). The currently matching quality is highlighted.

**Use case:** Quickly create standard chord types without manual voicing.

## Method 2: Piano Keyboard

**Location:** Main view, bottom section

### Clicking Notes

When the editor is open (left sidebar visible), clicking piano keys adds or removes notes from the chord voicing. This allows free-form chord construction.

### Root Indicator (Green Circle)

A draggable green circle marked "R" appears on the current root note. This indicator:
- Shows which note is interpreted as the root for chord naming
- Can be dragged to any piano key to change the root

### Root and Chord Naming

The root affects only chord *interpretation*, not the raw notes in the voicing. The same set of notes can produce different chord names depending on which note is designated as root:

| Notes | Root on C | Root on G |
|-------|-----------|-----------|
| C, F, G | Csus4 | Gsus2 |
| C, E, G, A | C6 | Am7/C |

This distinction matters for music theory (understanding the chord's function) but not for playback.

### Current Behavior (UX Issue)

**Note:** Currently, dragging the root indicator also transposes the entire chord. This happens because the voicing is stored as intervals relative to the root. When you change the root from C to G, the intervals stay the same but are now calculated from G, resulting in different absolute pitches.

This behavior can be confusing when users want to:
- Re-interpret a chord without changing its sound
- Experiment with different root assignments for the same notes

**Future improvement:** Consider separating "change root interpretation" from "transpose chord".

## Method 3: Voicing Editor Grid

**Location:** Left sidebar, below quality selector

### Grid Structure

A table with **7 columns** and **12 rows**:

- **Columns (1-7):** Represent note slots in the voicing, played in order from left to right
- **Rows (0-11):** Represent intervals from the root in semitones

| Row | Interval | Common Name |
|-----|----------|-------------|
| 0 | Unison | Root / Octave |
| 1 | Minor 2nd | b9 |
| 2 | Major 2nd | 9 |
| 3 | Minor 3rd | #9 |
| 4 | Major 3rd | |
| 5 | Perfect 4th | 11 |
| 6 | Diminished 5th | #11 |
| 7 | Perfect 5th | |
| 8 | Augmented 5th | b13 |
| 9 | Major 6th | 13 |
| 10 | Minor 7th | |
| 11 | Major 7th | |

### How It Works

- Each column can have **at most one cell** selected
- The selected row determines the interval for that voice
- Column order determines **note order in the voicing** (affects open vs. closed voicings)

### Example: C Major Chord

For a C major chord (root=C), the intervals are:
- Root (0 semitones) = C
- Major 3rd (4 semitones) = E
- Perfect 5th (7 semitones) = G

**Close voicing (C-E-G):**
- Column 1: Row 0 (Root)
- Column 2: Row 4 (Major 3rd)
- Column 3: Row 7 (Perfect 5th)

**Open voicing (C-G-E):**
- Column 1: Row 0 (Root)
- Column 2: Row 7 (Perfect 5th)
- Column 3: Row 4 (Major 3rd)

### Adding Octave Doublings

Selecting Row 0 (Root) in multiple columns adds the root at different octaves:
- Column 1: Row 0 → Root at base octave
- Column 4: Row 0 → Root one octave higher

The column position determines which octave the note appears in.

### Educational Value

This interface helps users understand:
- How chords are constructed from intervals
- The difference between chord quality and voicing
- How note ordering affects the sound (voicing/inversions)

### Current UX Limitations

The grid interface can be unintuitive for users who think in terms of specific notes rather than intervals. Creating a desired voicing requires:
1. Knowing the interval structure you want
2. Understanding that column position affects octave placement
3. Mental translation between note names and interval numbers

**Future improvement:** Consider alternative interfaces like a piano roll or note-name-based editor.

## Color Coding System

Each interval has a consistent color throughout the application:

| Interval | Color | Hex |
|----------|-------|-----|
| Root/Octave | Light green | #8ad252 |
| Minor 2nd | Brown | #927e2c |
| Major 2nd | Orange | #dea754 |
| Minor 3rd | Dark blue | #2e4fc4 |
| Major 3rd | Light blue | #5fa8ea |
| Perfect 4th | Yellow-green | #b7c717 |
| Diminished 5th | Rust | #bb7946 |
| Perfect 5th | Dark green | #45842b |
| Augmented 5th | Olive | #7f8b54 |
| Major 6th | Purple | #42318d |
| Minor 7th | Dark red | #bb3535 |
| Major 7th | Light red | #e87070 |

These colors appear:
- In the Voicing Editor grid rows
- As highlights on piano keys when editing (showing each note's interval relationship to the root)

This visual system helps users see interval relationships regardless of the chord's root note.
