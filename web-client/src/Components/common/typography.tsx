import styled from 'styled-components'

interface HeadingProps {
  fitted?: boolean
}

export const H1 = styled.h1<HeadingProps>`
  font-size: 3.5rem;
  font-family: 'Tangerine', cursive;
  ${(p) => (p.fitted ? 'margin: 0;' : '')}
`

export const H2 = styled.h2<HeadingProps>`
  ${(p) => (p.fitted ? 'margin: 0;' : '')}
`

export const H3 = styled.h3<HeadingProps>`
  ${(p) => (p.fitted ? 'margin: 0;' : '')}
`

export const SuperScript = styled.span`
  vertical-align: super;
  font-size: 0.8em;
  padding-left: 0.1em;
  line-height: 0.8em;
  font-weight: normal;
`

export const SubScript = styled.span`
  vertical-align: sub;
  font-size: 0.75em;
  padding-left: 0.1em;
  font-weight: normal;
`
