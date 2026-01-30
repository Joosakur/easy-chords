import type { Locator, Page } from '@playwright/test'

export class AppPage {
  readonly page: Page
  readonly editChordsButton: Locator

  constructor(page: Page) {
    this.page = page
    this.editChordsButton = page.locator('[data-test="edit-chords-button"]')
  }

  async goto() {
    await this.page.goto('/app')
  }

  chordSlot(row: number, col: number): Locator {
    return this.page.locator(`[data-test="chord-slot-${row}-${col}"]`)
  }

  async openChordEditor() {
    await this.editChordsButton.click()
  }

  async selectChordSlot(row: number, col: number) {
    await this.chordSlot(row, col).click()
  }
}
