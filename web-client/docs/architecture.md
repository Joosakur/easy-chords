# EasyChords Architecture

## Overview

EasyChords is a web-based chord playing and editing application. It allows musicians to:

- Play chords from a customizable 7x5 grid
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

The application uses Redux with four state slices:

- **settings** - MIDI output configuration (host, device selection, enabled state)
- **ui** - Sidebar visibility states
- **chordMap** - The 7x5 chord grid and edit mode state
- **piano** - Currently pressed keys and sustain pedal state

Redux-Saga handles side effects: playing notes, MIDI communication, and chord map loading.

## Layout

```
┌─────────────────────────────────────────────────────────┐
│                      Title Bar                          │
├─────────────┬───────────────────────────┬───────────────┤
│             │                           │               │
│   Chord     │      Chord Grid (7x5)     │   Settings    │
│   Editor    │                           │   Panel       │
│             ├───────────────────────────┤               │
│             │      Piano Keyboard       │               │
│             │                           │               │
└─────────────┴───────────────────────────┴───────────────┘
   (Left)              (Center)               (Right)
```

## Audio Output

The application supports two audio backends:

1. **MIDI Server** - HTTP API to a local MIDI server (default: `localhost:8080`)
2. **Web Audio** - Built-in synthesis using audiosynth.js (fallback when MIDI is disabled)

## Data Persistence

Chord maps can be exported/imported as JSON files using the `ChordMapDefinitionV1` format. See `types.md` for format details.
