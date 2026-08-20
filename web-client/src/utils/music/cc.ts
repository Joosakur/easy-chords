/**
 * Mapping from a pointer position on the CC pad to a MIDI Control Change value.
 *
 * @module utils/music/cc
 */

import { CC_PAD } from '../../config/constants'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Maps a 0-1 position along an axis onto the axis' configured value range.
 *
 * Narrowing the range spreads fewer values over the same travel, which is how the pad's sensitivity
 * is controlled. A range with `min` greater than `max` inverts the axis, which is intentional.
 */
export const ratioToCcValue = (ratio: number, min: number, max: number): number =>
  clamp(Math.round(min + clamp(ratio, 0, 1) * (max - min)), CC_PAD.MIN, CC_PAD.MAX)
