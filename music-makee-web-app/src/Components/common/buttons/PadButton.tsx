import React from 'react'
import styled from 'styled-components'
import { lighten, shade, tint, transparentize } from 'polished'
import classNames from 'classnames'
import { Colors, SPACING_LENGTHS } from '../style-constants'

interface StyledButtonProps {
  color: string
  selected: boolean
}
const StyledButton = styled.button<StyledButtonProps>`
  display: inline-block;
  height: 4.1rem;
  overflow: hidden;
  padding: 0 ${SPACING_LENGTHS.s};

  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 0 -1px 2px rgba(0, 0, 0, 0.5);

  &.thin {
    font-size: 1rem;
    height: 2em;
  }

  background: linear-gradient(
    ${(p) => shade(0.03, p.color)},
    ${(p) => tint(0.06, p.color)} 30%,
    ${(p) => shade(0.03, p.color)}
  );

  box-shadow: 0.1rem 0.2rem 2px ${(p) => shade(0.2, p.color)},
    0.1rem 0.6rem 2px ${(p) => shade(0.5, p.color)}, 0.3rem 1rem 1rem 2px rgba(0, 0, 0, 0.66),
    inset 1px 3px 2px rgba(255, 255, 255, 0.25), inset 1px 0 10px rgba(255, 255, 255, 0.1),
    inset 1px 0 5px rgba(255, 255, 255, 0.15),
    0.3rem 1rem 1.5rem -0.3rem rgba(0, 0, 0, 0.8) ${(p) => (p.selected ? `, 0 0.8rem 1.5rem ${transparentize(0.3, lighten(0.3, p.color))}` : '')};

  border: none;
  outline: none;
  border-radius: 8px;

  &:hover {
    background: linear-gradient(
      ${(p) => tint(0.01, p.color)},
      ${(p) => tint(0.08, p.color)} 30%,
      ${(p) => tint(0.03, p.color)}
    );
  }

  &:active,
  &.toggle.selected {
    background: linear-gradient(
      ${(p) => shade(0.03, p.color)} 0%,
      ${(p) => tint(0.04, p.color)} 10%,
      ${(p) => tint(0.04, p.color)} 30%,
      ${(p) => shade(0.1, p.color)} 80%,
      ${(p) => shade(0.3, p.color)} 100%
    );

    box-shadow: 0.1rem 0.2rem 0 ${(p) => shade(0.4, p.color)},
      0.1rem 0.25rem 2px 2px rgba(0, 0, 0, 0.4), inset 1px 2px 2px rgba(255, 255, 255, 0.15),
      inset 1px 0 5px rgba(255, 255, 255, 0.15), inset 1px 0 10px rgba(255, 255, 255, 0.1),
      0.3rem 0.6rem 0.8rem -0.3rem rgba(0, 0, 0, 0.4) ${(p) => (p.selected ? `, 0 0.4rem 1rem ${transparentize(0.5, lighten(0.3, p.color))}` : '')};

    span {
      opacity: 0.83;
    }

    margin-top: 0.4rem;
    margin-bottom: -0.4rem;
  }

  &.empty {
    opacity: 0.75;
    filter: saturate(0.2) brightness(1.3);
  }

  cursor: pointer;

  @media screen and (max-width: 800px) {
    padding: 0 ${SPACING_LENGTHS.xs};
    font-size: 0.8em;
  }
`

interface PadButtonProps {
  text: string
  onMouseDown?: (x: number, y: number) => any
  selected?: boolean
  empty?: boolean
  color?: string
  thin?: boolean
  toggle?: boolean

  className?: string
}

function PadButton({
  text,
  onMouseDown,
  selected = false,
  empty = false,
  thin = false,
  toggle = false,
  color,
  className
}: PadButtonProps) {
  return (
    <StyledButton
      className={classNames(className, { selected, empty, thin, toggle })}
      onMouseDown={(e: React.MouseEvent) => {
        e.persist()
        const { x, y, width, height } = e.currentTarget.getBoundingClientRect()
        const xr = Math.max(0, Math.min(1, (e.clientX - x) / (width + 1)))
        const yr = Math.max(0, Math.min(1, (e.clientY - y) / (height + 1)))
        onMouseDown && onMouseDown(xr, yr)
      }}
      color={selected ? Colors.states.active : color || Colors.primary}
      selected={selected}
    >
      <span className="text-high">{text}</span>
    </StyledButton>
  )
}

export default React.memo(PadButton)
