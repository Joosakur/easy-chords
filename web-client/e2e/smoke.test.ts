import { expect, test } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AppPage } from './pages/app.page'
import { ChordEditorPage } from './pages/chord-editor.page'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

test('export and import preserves chord map state', async ({ page }) => {
  const app = new AppPage(page)
  const chordEditor = new ChordEditorPage(page)

  await app.goto()
  await app.openChordEditor()

  // Create a chord in an empty slot
  await app.selectChordSlot(1, 0)
  await chordEditor.selectQuality('maj7')
  await expect(app.chordSlot(1, 0)).toHaveText('Cmaj7')

  // Export the chord map
  const download = await app.exportChordMap()
  const filePath = await download.path()

  // Reload page to reset to default state
  await page.reload()

  // Verify the chord is gone (slot should be empty after reload)
  await expect(app.chordSlot(1, 0)).toHaveText('')

  // Import the exported file
  await app.importChordMap(filePath!)

  // Verify the chord was restored
  await expect(app.chordSlot(1, 0)).toHaveText('Cmaj7')
})

test('shows alert when importing file without version field', async ({ page }) => {
  const app = new AppPage(page)

  await app.goto()

  // Create a temporary file missing the version field
  const tempDir = path.join(__dirname, '../node_modules/.cache/test-temp')
  fs.mkdirSync(tempDir, { recursive: true })
  const filePath = path.join(tempDir, 'missing-version.json')
  fs.writeFileSync(filePath, JSON.stringify({ chords: [] }))

  // Listen for the alert dialog
  let alertMessage = ''
  page.on('dialog', async (dialog) => {
    alertMessage = dialog.message()
    await dialog.accept()
  })

  // Try to import the invalid file
  await app.importChordMap(filePath)

  // Wait for the dialog to appear
  await page.waitForTimeout(500)

  // Verify the alert was shown
  expect(alertMessage).toContain('Failed to import chord map')
})

test('shows alert when importing file with invalid chord data', async ({ page }) => {
  const app = new AppPage(page)

  await app.goto()

  // Create a temporary file with version 1 but invalid chord structure
  const tempDir = path.join(__dirname, '../node_modules/.cache/test-temp')
  fs.mkdirSync(tempDir, { recursive: true })
  const filePath = path.join(tempDir, 'invalid-chords.json')
  fs.writeFileSync(
    filePath,
    JSON.stringify({
      version: 1,
      chords: [{ name: 'C', root: 'not-a-number', voicing: [], octave: 4 }],
    }),
  )

  // Listen for the alert dialog
  let alertMessage = ''
  page.on('dialog', async (dialog) => {
    alertMessage = dialog.message()
    await dialog.accept()
  })

  // Try to import the invalid file
  await app.importChordMap(filePath)

  // Wait for the dialog to appear
  await page.waitForTimeout(500)

  // Verify the alert was shown with Zod validation error
  expect(alertMessage).toContain('Failed to import chord map')
  expect(alertMessage).toContain('root')
})
