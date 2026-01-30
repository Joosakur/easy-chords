import { z } from 'zod'
import type { ChordMapDefinitionV1 } from '../../types'

const ChordV1Schema = z.object({
  name: z.string(),
  root: z.number().int().min(0).max(11),
  voicing: z.array(z.number().int()),
  octave: z.number().int().min(0).max(8),
})

const ChordMapV1Schema = z.object({
  version: z.literal(1),
  chords: z.array(ChordV1Schema.nullable()),
})

export type ParseResult =
  | { success: true; data: ChordMapDefinitionV1 }
  | { success: false; error: string }

export function parseChordMapJson(json: string): ParseResult {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return { success: false, error: 'Invalid JSON format' }
  }

  // Check version first for better error message
  if (typeof data === 'object' && data !== null && 'version' in data) {
    if ((data as { version: unknown }).version !== 1) {
      return {
        success: false,
        error: `Unsupported file version: ${(data as { version: unknown }).version}`,
      }
    }
  }

  const result = ChordMapV1Schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data as ChordMapDefinitionV1 }
  }

  // Format Zod errors into readable message
  const issues = result.error.issues
  const errorDetails = issues
    .slice(0, 3)
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ')

  return {
    success: false,
    error: `Invalid chord map format: ${errorDetails}`,
  }
}
