import styled from 'styled-components'
import { SPACING_LENGTHS, type SpacingSize } from '../style-constants'

interface GapProps {
  horizontal?: boolean
  size?: SpacingSize
}
export const Gap = styled.div<GapProps>`
  display: ${(p) => (p.horizontal ? 'inline-block' : 'block')};
  ${(p) => (p.horizontal ? 'width' : 'height')}: ${(p) => SPACING_LENGTHS[p.size ?? 'm']};
`
