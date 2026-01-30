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

## Phase 1: Testing Infrastructure Setup (COMPLETED)

- [x] Install dependencies (vitest, coverage, saga testing utilities)
- [x] Create `vitest.config.ts`
- [x] Add npm scripts (`test`, `test:watch`, `test:coverage`)
- [x] Create initial test to verify setup (11 tests, 96% coverage on chords.ts)

---

## Phase 2: Music Utility Tests (`src/utils/music/`) (COMPLETED)

- [x] `chords.ts` - 73 tests, 100% coverage
- [x] `synth.ts` - 18 tests for `numberToTone`

### `chords.ts`

| Function | Test Cases |
|----------|-----------|
| `getAbsoluteNotes` | Single note, multi-octave voicing, various roots/octaves, empty voicing |
| `voicingToGridVoicing` | Simple voicing, multi-octave spans, null insertion for large gaps, high first note |
| `gridVoicingToVoicing` | Round-trip verification, null handling, octave boundary detection, ascending notes |
| `getChordName` | All 37 chord qualities, all 12 roots, inversions with slash notation, unrecognized patterns |

### `synth.ts`

| Function | Test Cases |
|----------|-----------|
| `numberToTone` | All 12 tones, octave wrapping, MIDI note range (0-127) |

---

## Phase 3: Redux Slice & Selector Tests (COMPLETED)

- [x] `settings-slice.ts` - 16 tests (reducers, extraReducers, selectors)
- [x] `ui-slice.ts` - 15 tests (reducers, selectors)
- [x] `chord-map-slice.ts` - 28 tests (reducers, selectors)
- [x] `piano-slice.ts` - 18 tests (reducers, extraReducers, selectors)

| Slice | Reducer Tests | Selector Tests |
|-------|--------------|----------------|
| `settings` | `setMidiOutput`, `setHost`, async actions | `selectIsUsingMidi` (complex conditional) |
| `ui` | toggle/open/close actions | `selectIsEditorOpen`, `selectIsSettingsOpen` |
| `chordMap` | `setChord`, `clearChord`, `setEditMode`, `setActiveChordIndex`, `setChords` | `selectActiveChord`, `selectIsChordButtonSelected`, `selectEditMode` |
| `piano` | `pianoKeyDown`, `pianoKeyUp`, `pianoKeysUp`, `setSustainPedal` | `selectKeysDown`, `selectIsKeyDown`, `selectSustainPedal` |

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

## Test Coverage

| Phase | Focus | Tests |
|-------|-------|-------|
| 1 | Setup | - |
| 2 | Music utils | 91 |
| 3 | Redux slices | 77 |
| 4 | Sagas | ~15-20 |
| 5 | CI | (workflow file) |

**Current total:** 168 tests
