# Testing Plan

This document outlines the multi-phase plan for adding unit test coverage to the EasyChords web client.

## Scope

- Unit tests only (no e2e tests)
- No rendering/component tests
- Focus on: calculations, algorithms, Redux state management

## Tech Stack

- **Test Runner:** Vitest
- **Coverage:** @vitest/coverage-v8
- **Saga Testing:** redux-saga-test-plan
- **Store Mocking:** redux-mock-store

---

## Phase 1: Testing Infrastructure Setup

- [x] Install dependencies (vitest, coverage, saga testing utilities)
- [x] Create `vitest.config.ts`
- [x] Add npm scripts (`test`, `test:watch`, `test:coverage`)
- [x] Create initial test to verify setup

---

## Phase 2: Music Utility Tests (`src/utils/music/`)

### `chords.ts`

| Function | Test Cases |
|----------|-----------|
| `getAbsoluteNotes` | Single note, multi-octave voicing, various roots/octaves |
| `voicingToGridVoicing` | Simple voicing, multi-octave spans, null insertion for large gaps |
| `gridVoicingToVoicing` | Round-trip verification, null handling, octave boundary detection |
| `getChordName` | All chord qualities (major, minor, dim, aug, 7ths, etc.), inversions with slash notation, unrecognized patterns |
| `setsEqual` | Equal sets, different sizes, different elements |

### `synth.ts`

| Function | Test Cases |
|----------|-----------|
| `numberToTone` | MIDI notes 0-127, correct tone names, octave wrapping |

---

## Phase 3: Redux Slice & Selector Tests

| Slice | Reducer Tests | Selector Tests |
|-------|--------------|----------------|
| `settings` | `setMidiOutput`, `setHost` | `selectIsUsingMidi` (MIDI enabled + valid device) |
| `ui` | toggle/open/close actions | `selectIsEditorOpen`, `selectIsSettingsOpen` |
| `chordMap` | `setChord`, `clearChord`, `setEditMode`, `setActiveChordIndex` | `selectActiveChord`, `selectIsChordButtonSelected` |
| `piano` | `pianoKeyDown`, `pianoKeyUp`, `pianoKeysUp` | (no selectors) |

---

## Phase 4: Redux Saga Tests

Test saga side effect logic using `redux-saga-test-plan`.

| Saga | Test Focus |
|------|-----------|
| `chordClickedSaga` | Normal mode plays chord, copy/swap modes, velocity calculation |
| `pianoKeyClickedSaga` | Editor closed → plays note, editor open → toggles voicing |
| `playNoteSaga` | Routes to MIDI API vs Web Audio based on settings |
| `playChordSaga` | Stops previous notes, plays new notes, MIDI vs Web Audio routing |

---

## Phase 5: GitHub Actions CI

Create `.github/workflows/test.yml`:
- Trigger on push to master and PRs
- Node.js setup
- `npm ci` → `npm run test:coverage`
- Fail on test failures

---

## Estimated Coverage

| Phase | Focus | Estimated Tests |
|-------|-------|-----------------|
| 1 | Setup | 1 (placeholder) |
| 2 | Music utils | ~30-40 |
| 3 | Redux slices | ~25-30 |
| 4 | Sagas | ~15-20 |
| 5 | CI | (workflow file) |

**Total:** ~70-90 unit tests
