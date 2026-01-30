import type { Download, Locator, Page } from '@playwright/test'

export class AppPage {
  readonly page: Page
  readonly editChordsButton: Locator
  readonly exportButton: Locator
  readonly importButton: Locator
  readonly importFileInput: Locator

  constructor(page: Page) {
    this.page = page
    this.editChordsButton = page.locator('[data-test="edit-chords-button"]')
    this.exportButton = page.locator('[data-test="export-button"]')
    this.importButton = page.locator('[data-test="import-button"]')
    this.importFileInput = page.locator('[data-test="import-file-input"]')
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

  async exportChordMap(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download')
    await this.exportButton.click()
    return downloadPromise
  }

  async importChordMap(filePath: string) {
    await this.importFileInput.setInputFiles(filePath)
  }
}
