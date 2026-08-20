import type { Locator, Page } from '@playwright/test'

type Axis = 'x' | 'y'

export class CcPadPage {
  readonly page: Page
  readonly toggleButton: Locator
  readonly surface: Locator

  constructor(page: Page) {
    this.page = page
    this.toggleButton = page.locator('[data-test="cc-pad-button"]')
    this.surface = page.locator('[data-test="cc-pad-surface"]')
  }

  value(axis: Axis): Locator {
    return this.page.locator(`[data-test="cc-value-${axis}"]`)
  }

  ccNumber(axis: Axis): Locator {
    return this.page.locator(`[data-test="cc-number-${axis}"]`)
  }

  min(axis: Axis): Locator {
    return this.page.locator(`[data-test="cc-min-${axis}"]`)
  }

  max(axis: Axis): Locator {
    return this.page.locator(`[data-test="cc-max-${axis}"]`)
  }

  size(axis: Axis): Locator {
    return this.page.locator(`[data-test="cc-size-${axis}"]`)
  }

  enabled(axis: Axis): Locator {
    return this.page.locator(`[data-test="cc-enabled-${axis}"]`)
  }

  async open() {
    await this.toggleButton.click()
  }

  /**
   * Screen coordinates for a relative position on the pad, where 0,0 is the bottom left corner and
   * 1,1 is the top right. Kept half a pixel inside the box, since the coordinate at exactly the
   * edge lands outside the element and would not hit the pad at all. Half a pixel rather than a
   * whole one so that the extremes still round to the ends of the range on a small pad. Push only
   * one axis to an extreme at a time - the pad's rounded corners are not part of the element, so a
   * corner press misses.
   */
  private async pointAt(xRatio: number, yRatio: number): Promise<[number, number]> {
    const box = await this.surface.boundingBox()
    if (!box) throw new Error('CC pad surface is not visible')

    const inside = (length: number, ratio: number) =>
      Math.min(length - 0.5, Math.max(0.5, length * ratio))

    return [box.x + inside(box.width, xRatio), box.y + inside(box.height, 1 - yRatio)]
  }

  async pressAt(xRatio: number, yRatio: number) {
    const [x, y] = await this.pointAt(xRatio, yRatio)
    await this.page.mouse.move(x, y)
    await this.page.mouse.down()
    await this.page.mouse.up()
  }

  /** Presses at the first position and drags to the second without releasing in between. */
  async dragFromTo(from: [number, number], to: [number, number]) {
    const [startX, startY] = await this.pointAt(from[0], from[1])
    const [endX, endY] = await this.pointAt(to[0], to[1])

    await this.page.mouse.move(startX, startY)
    await this.page.mouse.down()
    await this.page.mouse.move(endX, endY, { steps: 10 })
    await this.page.mouse.up()
  }
}
