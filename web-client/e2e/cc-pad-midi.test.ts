import { expect, test } from '@playwright/test'
import { CcPadPage } from './pages/cc-pad.page'
import { enableMidiOutput, MidiServerMock } from './pages/midi-server.mock'

test('sends control change messages to the MIDI server while dragging', async ({ page }) => {
  const midi = new MidiServerMock()
  await midi.install(page)

  const ccPad = new CcPadPage(page)
  await page.goto('/app')
  await enableMidiOutput(page)
  await ccPad.open()

  await ccPad.dragFromTo([0, 0.5], [1, 0.5])

  await expect.poll(() => midi.valuesFor(1).at(-1)).toBe(127)

  const modulation = midi.valuesFor(1)
  // A drag sweeps through the range rather than jumping straight to the end
  expect(modulation.length).toBeGreaterThan(2)
  expect(modulation[0]).toBeLessThan(modulation.at(-1)!)

  // Everything goes out on channel 0, which a DAW shows as channel 1
  expect(midi.ccRequests.every((r) => r.channel === 0)).toBe(true)
})

test('does not resend a value that has not changed', async ({ page }) => {
  const midi = new MidiServerMock()
  await midi.install(page)

  const ccPad = new CcPadPage(page)
  await page.goto('/app')
  await enableMidiOutput(page)
  await ccPad.open()

  await ccPad.pressAt(0.5, 0.5)
  await expect.poll(() => midi.ccRequests.length).toBe(2)

  await ccPad.pressAt(0.5, 0.5)
  await ccPad.pressAt(0.5, 0.5)
  await expect(ccPad.value('x')).toHaveText('X · CC 1: 64')
  expect(midi.ccRequests).toHaveLength(2)
})

test('sends the configured CC number and range', async ({ page }) => {
  const midi = new MidiServerMock()
  await midi.install(page)

  const ccPad = new CcPadPage(page)
  await page.goto('/app')
  await enableMidiOutput(page)
  await ccPad.open()

  await ccPad.ccNumber('y').fill('21')
  await ccPad.min('y').fill('40')
  await ccPad.max('y').fill('80')

  await ccPad.pressAt(0.5, 1)
  await expect.poll(() => midi.valuesFor(21)).toEqual([80])
})
