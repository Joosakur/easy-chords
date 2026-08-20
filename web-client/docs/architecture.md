# EasyChords Architecture

## Overview

EasyChords is a web-based chord playing and editing application. It allows musicians to:

- Play chords from a 7-column grid (rows vary by preset/import)
- Send continuous MIDI Control Change from a 2D pad (vibrato, dynamics, expression)
- Play individual notes on a visual piano keyboard
- Create and edit chord voicings
- Output sound via MIDI (to external synthesizers) or Web Audio (built-in fallback)

## Application Structure

```
/app          → Main application (RootComponent)
/             → Help and documentation pages
```

## Technology Stack

| Layer            | Technology        |
|------------------|-------------------|
| UI Framework     | React 18          |
| State Management | Redux Toolkit     |
| Side Effects     | Redux-Saga        |
| Routing          | Wouter            |
| Drag & Drop      | dnd-kit           |
| Styling          | Styled-Components |
| Build Tool       | Vite              |

## State Architecture

The application uses Redux with five state slices:

- **settings** - MIDI output configuration (host, device selection, enabled state)
- **ui** - Sidebar and CC pad visibility states
- **chordMap** - The chord grid and edit mode state
- **piano** - Currently pressed keys and sustain pedal state
- **ccPad** - Per-axis CC assignment and range for the 2D controller

Redux-Saga handles side effects: playing notes, MIDI communication, and chord map loading.

## Layout

```
┌─────────────────────────────────────────────────────────┐
│                      Title Bar                          │
├─────────────┬───────────────────────────┬───────────────┤
│             │                           │               │
│   Chord     │        Chord Grid         │   Settings    │
│   Editor    │                           │   Panel       │
│             ├───────────────────────────┤               │
│             │      Piano Keyboard       │               │
│             │                           │               │
└─────────────┴───────────────────────────┴───────────────┘
   (Left)              (Center)               (Right)
```

The CC pad is a mode rather than a panel: while it is open it replaces the chord grid and the piano
in the centre column, so the pad gets the full width and height available.

## Audio Output

The application supports two audio backends:

1. **MIDI Server** - HTTP API to a local MIDI server (default: `localhost:8080`)
2. **Web Audio** - Built-in synthesis using audiosynth.js (fallback when MIDI is disabled)

## Data Persistence

Chord maps can be exported/imported as JSON files using the `ChordMapDefinitionV1` format. See `types.md` for format details.
