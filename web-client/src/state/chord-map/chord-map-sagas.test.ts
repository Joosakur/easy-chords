import { select } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { describe, expect, it } from 'vitest'
import type { ChordV1 } from '../../types'
import { chordClicked, importChordMap } from './chord-map-saga-actions'
import { chordClickedSaga, importChordMapSaga } from './chord-map-sagas'
import {
  selectActiveChord,
  selectActiveChordIndex,
  selectChords,
  selectEditMode,
  setActiveChordIndex,
  setChord,
  setChords,
  setEditMode,
} from './chord-map-slice'

const testChord: ChordV1 = {
  name: 'C',
  root: 0,
  octave: 4,
  voicing: [0, 4, 7],
}

const anotherChord: ChordV1 = {
  name: 'Am',
  root: 9,
  octave: 4,
  voicing: [0, 3, 7],
}

describe('chord-map sagas', () => {
  describe('chordClickedSaga', () => {
    describe('normal mode (editMode === null)', () => {
      it('plays chord and sets active index when chord exists', async () => {
        const chords = [testChord, null, anotherChord]

        const { effects } = await expectSaga(
          chordClickedSaga,
          chordClicked({ index: 0, x: 0.5, y: 0 }),
        )
          .provide([
            [select(selectEditMode), null],
            [select(selectChords), chords],
          ])
          .put(setActiveChordIndex(0))
          .run()

        // Verify playChord was called (can't check exact payload due to random velocity)
        const putEffects = effects.put || []
        const playChordEffect = putEffects.find((e) => e.payload.action.type === 'piano/playChord')
        expect(playChordEffect).toBeDefined()
      })

      it('only sets active index when chord slot is empty', async () => {
        const chords = [null, null, null]

        await expectSaga(chordClickedSaga, chordClicked({ index: 1, x: 0.5, y: 0 }))
          .provide([
            [select(selectEditMode), null],
            [select(selectChords), chords],
          ])
          .put(setActiveChordIndex(1))
          .not.put.actionType('piano/playChord')
          .run()
      })

      it('calculates velocity based on x position (x=0)', async () => {
        const chords = [testChord]

        const { effects } = await expectSaga(
          chordClickedSaga,
          chordClicked({ index: 0, x: 0, y: 0 }),
        )
          .provide([
            [select(selectEditMode), null],
            [select(selectChords), chords],
          ])
          .run()

        const putEffects = effects.put || []
        const playChordEffect = putEffects.find((e) => e.payload.action.type === 'piano/playChord')
        expect(playChordEffect).toBeDefined()
        const velocities = playChordEffect!.payload.action.payload.notes.map(
          (n: { velocity: number }) => n.velocity,
        )
        // With x=0, base velocity is 50, plus random 0-6
        velocities.forEach((v: number) => {
          expect(v).toBeGreaterThanOrEqual(50)
          expect(v).toBeLessThan(57)
        })
      })

      it('calculates velocity based on x position (x=1)', async () => {
        const chords = [testChord]

        const { effects } = await expectSaga(
          chordClickedSaga,
          chordClicked({ index: 0, x: 1, y: 0 }),
        )
          .provide([
            [select(selectEditMode), null],
            [select(selectChords), chords],
          ])
          .run()

        const putEffects = effects.put || []
        const playChordEffect = putEffects.find((e) => e.payload.action.type === 'piano/playChord')
        expect(playChordEffect).toBeDefined()
        const velocities = playChordEffect!.payload.action.payload.notes.map(
          (n: { velocity: number }) => n.velocity,
        )
        // With x=1, base velocity is 110, plus random 0-6
        velocities.forEach((v: number) => {
          expect(v).toBeGreaterThanOrEqual(110)
          expect(v).toBeLessThan(117)
        })
      })
    })

    describe('copy mode', () => {
      it('copies active chord to clicked index', async () => {
        await expectSaga(chordClickedSaga, chordClicked({ index: 5, x: 0, y: 0 }))
          .provide([
            [select(selectEditMode), 'copy'],
            [select(selectActiveChord), testChord],
            [select(selectActiveChordIndex), 0],
          ])
          .put(setChord({ chord: testChord, index: 5 }))
          .put(setEditMode(null))
          .run()
      })

      it('copies null active chord', async () => {
        await expectSaga(chordClickedSaga, chordClicked({ index: 5, x: 0, y: 0 }))
          .provide([
            [select(selectEditMode), 'copy'],
            [select(selectActiveChord), null],
            [select(selectActiveChordIndex), 0],
          ])
          .put(setChord({ chord: null, index: 5 }))
          .put(setEditMode(null))
          .run()
      })

      it('does nothing when no active chord index', async () => {
        await expectSaga(chordClickedSaga, chordClicked({ index: 5, x: 0, y: 0 }))
          .provide([
            [select(selectEditMode), 'copy'],
            [select(selectActiveChord), testChord],
            [select(selectActiveChordIndex), null],
          ])
          .not.put.actionType('chordMap/setChord')
          .run()
      })
    })

    describe('swap mode', () => {
      it('swaps active chord with clicked chord', async () => {
        const chords = [testChord, anotherChord, null]

        await expectSaga(chordClickedSaga, chordClicked({ index: 1, x: 0, y: 0 }))
          .provide([
            [select(selectEditMode), 'swap'],
            [select(selectActiveChord), testChord],
            [select(selectActiveChordIndex), 0],
            [select(selectChords), chords],
          ])
          .put(setChord({ chord: testChord, index: 1 }))
          .put(setChord({ chord: anotherChord, index: 0 }))
          .put(setEditMode(null))
          .run()
      })

      it('swaps with null slot', async () => {
        const chords = [testChord, null, null]

        await expectSaga(chordClickedSaga, chordClicked({ index: 2, x: 0, y: 0 }))
          .provide([
            [select(selectEditMode), 'swap'],
            [select(selectActiveChord), testChord],
            [select(selectActiveChordIndex), 0],
            [select(selectChords), chords],
          ])
          .put(setChord({ chord: testChord, index: 2 }))
          .put(setChord({ chord: null, index: 0 }))
          .put(setEditMode(null))
          .run()
      })

      it('does nothing when no active chord index', async () => {
        await expectSaga(chordClickedSaga, chordClicked({ index: 1, x: 0, y: 0 }))
          .provide([
            [select(selectEditMode), 'swap'],
            [select(selectActiveChord), testChord],
            [select(selectActiveChordIndex), null],
          ])
          .not.put.actionType('chordMap/setChord')
          .run()
      })
    })
  })

  describe('importChordMapSaga', () => {
    it('imports valid v1 chord map', async () => {
      const chordMap = {
        version: 1,
        chords: [testChord, null, anotherChord],
      }

      await expectSaga(importChordMapSaga, importChordMap(JSON.stringify(chordMap)))
        .put(setActiveChordIndex(null))
        .put(setChords(chordMap.chords))
        .run()
    })

    it('clears active index before import', async () => {
      const chordMap = { version: 1, chords: [] }

      const { effects } = await expectSaga(
        importChordMapSaga,
        importChordMap(JSON.stringify(chordMap)),
      ).run()

      const putEffects = effects.put || []
      const firstPut = putEffects[0]
      expect(firstPut.payload.action.type).toBe('chordMap/setActiveChordIndex')
    })

    it('ignores invalid JSON', async () => {
      await expectSaga(importChordMapSaga, importChordMap('not valid json'))
        .put(setActiveChordIndex(null))
        .not.put.actionType('chordMap/setChords')
        .run()
    })

    it('ignores unsupported version', async () => {
      const chordMap = { version: 99, chords: [] }

      await expectSaga(importChordMapSaga, importChordMap(JSON.stringify(chordMap)))
        .put(setActiveChordIndex(null))
        .not.put.actionType('chordMap/setChords')
        .run()
    })
  })
})
