import { expect, test } from '@playwright/test'
import { AppPage } from './pages/app.page'
import { ChordEditorPage } from './pages/chord-editor.page'

test('app loads and renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'EasyChords', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Open EasyChords app!' }).click()
  await expect(page.getByRole('button', { name: 'Edit Chords' })).toBeVisible()
})

test('can add Cmaj7 chord below default C chord', async ({ page }) => {
  const app = new AppPage(page)
  const chordEditor = new ChordEditorPage(page)

  await app.goto()
  await app.openChordEditor()

  // Select empty slot below the default C chord (row 1, col 0)
  await app.selectChordSlot(1, 0)

  // Select maj7 quality (root is already C by default)
  await chordEditor.selectQuality('maj7')

  // Verify the chord was created
  await expect(app.chordSlot(1, 0)).toHaveText('Cmaj7')
})
