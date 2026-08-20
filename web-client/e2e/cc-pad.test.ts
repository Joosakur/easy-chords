import { expect, test } from '@playwright/test'
import { AppPage } from './pages/app.page'
import { CcPadPage } from './pages/cc-pad.page'

test('pad emits the value under the pointer and latches it on release', async ({ page }) => {
  const app = new AppPage(page)
  const ccPad = new CcPadPage(page)

  await app.goto()
  await ccPad.open()

  // Nothing has been sent yet
  await expect(ccPad.value('x')).toHaveText('X · CC 1: —')
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: —')

  await ccPad.pressAt(1, 0.5)
  await expect(ccPad.value('x')).toHaveText('X · CC 1: 127')

  await ccPad.pressAt(0, 0.5)
  await expect(ccPad.value('x')).toHaveText('X · CC 1: 0')

  await ccPad.pressAt(0.5, 1)
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: 127')

  await ccPad.pressAt(0.5, 0)
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: 0')

  // Releasing holds the last value instead of resetting it
  await page.mouse.move(0, 0)
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: 0')
})

test('dragging emits values continuously', async ({ page }) => {
  const app = new AppPage(page)
  const ccPad = new CcPadPage(page)

  await app.goto()
  await ccPad.open()

  await ccPad.dragFromTo([0, 0.5], [1, 0.5])
  await expect(ccPad.value('x')).toHaveText('X · CC 1: 127')
})

test('narrowing an axis range scales the values it emits', async ({ page }) => {
  const app = new AppPage(page)
  const ccPad = new CcPadPage(page)

  await app.goto()
  await ccPad.open()

  await ccPad.min('y').fill('40')
  await ccPad.max('y').fill('80')

  await ccPad.pressAt(0.5, 1)
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: 80')

  await ccPad.pressAt(0.5, 0)
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: 40')

  await ccPad.pressAt(0.5, 0.5)
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: 60')
})

test('a disabled axis emits nothing', async ({ page }) => {
  const app = new AppPage(page)
  const ccPad = new CcPadPage(page)

  await app.goto()
  await ccPad.open()

  await ccPad.enabled('y').click()
  await expect(ccPad.enabled('y')).toHaveText('Off')

  await ccPad.pressAt(1, 0.5)
  await expect(ccPad.value('x')).toHaveText('X · CC 1: 127')
  await expect(ccPad.value('y')).toHaveText('Y · CC 11: —')
})

test('the assigned CC number is shown in the readout', async ({ page }) => {
  const app = new AppPage(page)
  const ccPad = new CcPadPage(page)

  await app.goto()
  await ccPad.open()

  await ccPad.ccNumber('x').fill('74')
  await expect(ccPad.value('x')).toHaveText('X · CC 74: —')
})

test('pad replaces the chord grid and can be toggled back', async ({ page }) => {
  const app = new AppPage(page)
  const ccPad = new CcPadPage(page)

  await app.goto()
  await expect(app.chordSlot(0, 0)).toBeVisible()

  await ccPad.open()
  await expect(ccPad.surface).toBeVisible()
  await expect(app.chordSlot(0, 0)).toBeHidden()
  await expect(app.editChordsButton).toBeHidden()

  await ccPad.toggleButton.click()
  await expect(ccPad.surface).toBeHidden()
  await expect(app.chordSlot(0, 0)).toBeVisible()
})

test('resizing an axis shrinks the pad along that axis', async ({ page }) => {
  const app = new AppPage(page)
  const ccPad = new CcPadPage(page)

  await app.goto()
  await ccPad.open()

  const full = (await ccPad.surface.boundingBox())!

  await page.getByRole('button', { name: 'Shrink X axis' }).click()
  await expect(ccPad.size('x')).toHaveText('25%')

  const shrunk = (await ccPad.surface.boundingBox())!
  expect(shrunk.width).toBeLessThan(full.width)
  expect(shrunk.height).toBe(full.height)
})
