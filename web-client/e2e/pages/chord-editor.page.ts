import type { Locator, Page } from '@playwright/test'

export type ChordQuality =
  | 'sus2'
  | 'aug'
  | 'sus4'
  | '7'
  | 'major'
  | 'maj7'
  | 'm7'
  | 'minor'
  | 'mmaj7'
  | 'dim7'
  | 'dim'
  | 'm7b5'

export class ChordEditorPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  qualityButton(quality: ChordQuality): Locator {
    return this.page.locator(`[data-test="quality-${quality}"]`)
  }

  async selectQuality(quality: ChordQuality) {
    await this.qualityButton(quality).click()
  }
}
