import { expect, type Page, type Route } from '@playwright/test'

export interface CcRequest {
  channel: number
  cc: number
  value: number
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

/**
 * Stands in for the local MIDI server so the app can be driven with MIDI output enabled, and
 * records the CC messages it receives.
 */
export class MidiServerMock {
  readonly ccRequests: CcRequest[] = []

  async install(page: Page) {
    const respond = (route: Route, body?: unknown) =>
      route.fulfill({
        status: body === undefined ? 204 : 200,
        headers: corsHeaders,
        contentType: body === undefined ? undefined : 'application/json',
        body: body === undefined ? undefined : JSON.stringify(body),
      })

    // Playwright gives precedence to the route registered last, so the catch-all goes first
    await page.route('http://localhost:8080/**', (route) => respond(route))

    await page.route('http://localhost:8080/devices', (route) => {
      if (route.request().method() === 'GET') {
        return respond(route, [{ name: 'Test Port', description: 'Virtual MIDI' }])
      }
      return respond(route)
    })

    await page.route('http://localhost:8080/cc', (route) => {
      if (route.request().method() === 'POST') {
        this.ccRequests.push(route.request().postDataJSON())
      }
      return respond(route)
    })
  }

  valuesFor(cc: number): number[] {
    return this.ccRequests.filter((r) => r.cc === cc).map((r) => r.value)
  }
}

export async function enableMidiOutput(page: Page) {
  await page.getByRole('button', { name: 'Settings' }).click()

  // The device dropdown only appears once the device list has been fetched
  const devicesLoaded = page.waitForResponse(
    (response) => response.url().endsWith('/devices') && response.request().method() === 'GET',
  )
  await page.getByRole('combobox').first().selectOption({ label: 'Use external MIDI' })
  await devicesLoaded

  await expect(page.getByRole('combobox')).toHaveCount(2)
  await page.getByRole('combobox').last().selectOption({ label: 'Test Port - Virtual MIDI' })
  await page.getByRole('button', { name: 'Close sidebar' }).click()
}
