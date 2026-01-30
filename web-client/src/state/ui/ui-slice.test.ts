import { describe, expect, it } from 'vitest'
import type { RootState } from '../root-reducer'
import reducer, {
  closeEditor,
  closeSettings,
  initialUIState,
  openEditor,
  openSettings,
  selectIsEditorOpen,
  selectIsSettingsOpen,
  toggleEditor,
  toggleSettings,
  type UIState,
} from './ui-slice'

const createRootState = (ui: Partial<UIState> = {}): RootState =>
  ({
    ui: { ...initialUIState, ...ui },
  }) as RootState

describe('ui slice', () => {
  describe('reducers', () => {
    describe('settings', () => {
      it('openSettings sets settingsOpen to true', () => {
        const state = reducer(initialUIState, openSettings())
        expect(state.settingsOpen).toBe(true)
      })

      it('closeSettings sets settingsOpen to false', () => {
        const openState: UIState = { ...initialUIState, settingsOpen: true }
        const state = reducer(openState, closeSettings())
        expect(state.settingsOpen).toBe(false)
      })

      it('toggleSettings toggles from false to true', () => {
        const state = reducer(initialUIState, toggleSettings())
        expect(state.settingsOpen).toBe(true)
      })

      it('toggleSettings toggles from true to false', () => {
        const openState: UIState = { ...initialUIState, settingsOpen: true }
        const state = reducer(openState, toggleSettings())
        expect(state.settingsOpen).toBe(false)
      })
    })

    describe('editor', () => {
      it('openEditor sets editorOpen to true', () => {
        const state = reducer(initialUIState, openEditor())
        expect(state.editorOpen).toBe(true)
      })

      it('closeEditor sets editorOpen to false', () => {
        const openState: UIState = { ...initialUIState, editorOpen: true }
        const state = reducer(openState, closeEditor())
        expect(state.editorOpen).toBe(false)
      })

      it('toggleEditor toggles from false to true', () => {
        const state = reducer(initialUIState, toggleEditor())
        expect(state.editorOpen).toBe(true)
      })

      it('toggleEditor toggles from true to false', () => {
        const openState: UIState = { ...initialUIState, editorOpen: true }
        const state = reducer(openState, toggleEditor())
        expect(state.editorOpen).toBe(false)
      })
    })

    describe('independence', () => {
      it('opening settings does not affect editor', () => {
        const state = reducer(initialUIState, openSettings())
        expect(state.settingsOpen).toBe(true)
        expect(state.editorOpen).toBe(false)
      })

      it('opening editor does not affect settings', () => {
        const state = reducer(initialUIState, openEditor())
        expect(state.editorOpen).toBe(true)
        expect(state.settingsOpen).toBe(false)
      })

      it('both can be open at the same time', () => {
        let state = reducer(initialUIState, openSettings())
        state = reducer(state, openEditor())
        expect(state.settingsOpen).toBe(true)
        expect(state.editorOpen).toBe(true)
      })
    })
  })

  describe('selectors', () => {
    describe('selectIsEditorOpen', () => {
      it('returns false when editor is closed', () => {
        const rootState = createRootState({ editorOpen: false })
        expect(selectIsEditorOpen(rootState)).toBe(false)
      })

      it('returns true when editor is open', () => {
        const rootState = createRootState({ editorOpen: true })
        expect(selectIsEditorOpen(rootState)).toBe(true)
      })
    })

    describe('selectIsSettingsOpen', () => {
      it('returns false when settings is closed', () => {
        const rootState = createRootState({ settingsOpen: false })
        expect(selectIsSettingsOpen(rootState)).toBe(false)
      })

      it('returns true when settings is open', () => {
        const rootState = createRootState({ settingsOpen: true })
        expect(selectIsSettingsOpen(rootState)).toBe(true)
      })
    })
  })
})
