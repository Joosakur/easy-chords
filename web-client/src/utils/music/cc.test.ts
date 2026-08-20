import { describe, expect, it } from 'vitest'
import { ratioToCcValue } from './cc'

describe('ratioToCcValue', () => {
  it('maps the ends of the pad to the ends of the range', () => {
    expect(ratioToCcValue(0, 0, 127)).toBe(0)
    expect(ratioToCcValue(1, 0, 127)).toBe(127)
  })

  it('maps the middle of the pad to the middle of the range', () => {
    expect(ratioToCcValue(0.5, 0, 100)).toBe(50)
  })

  it('scales to a narrowed range so the same travel gives finer control', () => {
    expect(ratioToCcValue(0, 40, 80)).toBe(40)
    expect(ratioToCcValue(0.5, 40, 80)).toBe(60)
    expect(ratioToCcValue(1, 40, 80)).toBe(80)
  })

  it('inverts the axis when min is greater than max', () => {
    expect(ratioToCcValue(0, 127, 0)).toBe(127)
    expect(ratioToCcValue(1, 127, 0)).toBe(0)
  })

  it('clamps ratios outside 0-1, so dragging past the edge holds the extreme', () => {
    expect(ratioToCcValue(-0.4, 0, 127)).toBe(0)
    expect(ratioToCcValue(2.5, 0, 127)).toBe(127)
  })

  it('rounds to whole CC values', () => {
    expect(ratioToCcValue(0.5, 0, 127)).toBe(64)
    expect(ratioToCcValue(0.01, 0, 127)).toBe(1)
  })

  it('keeps the result within the MIDI range even if the configured range is not', () => {
    expect(ratioToCcValue(1, 0, 500)).toBe(127)
    expect(ratioToCcValue(0, -50, 127)).toBe(0)
  })
})
