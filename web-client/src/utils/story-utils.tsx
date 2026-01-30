import styled from 'styled-components'

export const LoremParagraph = () => (
  <p className="text-high">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
)

export const Resizer = styled.div`
  resize: both;
  overflow: auto;
  border: gray dashed 1px;
  width: 50%;
`

interface SegmentProps {
  color: string
}

export const StorySegment = styled.div<SegmentProps>`
  background: ${(p) => p.color};
  width: 100%;
  padding: 2rem;
`
