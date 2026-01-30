import { expect, test } from '@playwright/test'

test('app loads and renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'EasyChords', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Open EasyChords app!' }).click()
  await expect(page.getByRole('button', { name: 'Edit Chords' })).toBeVisible()
})
