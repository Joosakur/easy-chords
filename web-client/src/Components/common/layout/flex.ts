import styled from 'styled-components'
import { SPACING_LENGTHS, type SpacingSize } from '../style-constants'

interface FixedSpacingProps {
  column?: boolean
  spacing?: SpacingSize
  wrap?: boolean
  grow?: number
}
export const FixedSpacing = styled.div<FixedSpacingProps>`
  display: flex;
  flex-direction: ${(p) => (p.column ? 'column' : 'row')};
  align-items: center;

  ${(p) => (p.column ? 'width: fit-content;' : '')}
  ${(p) => (p.grow ? `flex-grow: ${p.grow};` : '')}

  ${(p) =>
    p.wrap
      ? `
    flex-wrap: wrap;
    >* {
      margin-bottom: ${SPACING_LENGTHS.s};
      margin-right: ${SPACING_LENGTHS[p.spacing ?? 'm']};
    }
    margin-right: -${SPACING_LENGTHS[p.spacing ?? 'm']};
  `
      : `
    > * {
      margin-${p.column ? 'bottom' : 'right'}: ${SPACING_LENGTHS[p.spacing ?? 'm']};
      &:last-child {
        margin-${p.column ? 'bottom' : 'right'}: 0;
      }
    }
  `}
`

export const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
