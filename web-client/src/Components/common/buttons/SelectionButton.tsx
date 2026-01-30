import classNames from 'classnames'
import { shade, tint } from 'polished'
import type React from 'react'
import styled from 'styled-components'
import { FadedColors } from '../style-constants'

interface StyledButtonProps {
  color: string
}
const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2em 0.33em;

  font-size: 1.5em;
  font-weight: normal;
  white-space: nowrap;

  border: none;
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  background: ${(p) => p.color};
  box-shadow: 1px 2px 1px ${(p) => shade(0.5, p.color)}, 1px 3px 5px 3px rgba(0, 0, 0, 0.6),
    inset 1px 1px 1px rgba(255, 255, 255, 0.3), inset 1px 3px 0.6rem rgba(255, 255, 255, 0.3);

  &:hover {
    background: ${(p) => tint(0.06, p.color)};
  }
  &:active,
  &.selected {
    background: ${(p) => shade(0.06, p.color)};
    box-shadow: 1px 1px 0 ${(p) => shade(0.5, p.color)}, 1px 2px 1px 1px rgba(0, 0, 0, 0.15),
      inset 1px 1px 2px rgba(255, 255, 255, 0.1), inset 1px 2px 0.6rem rgba(255, 255, 255, 0.1);
    margin-top: 1px;
    margin-bottom: -1px;
  }

  &.circular {
    border-radius: 100%;
    height: 2.2em;
    width: 2.2em;
  }
`

interface SelectionButtonProps {
  onClick: () => any
  children: React.ReactNode
  circular?: boolean
  selected?: boolean

  className?: string
}

function SelectionButton({
  onClick,
  children,
  circular,
  selected,
  className,
}: SelectionButtonProps) {
  return (
    <StyledButton
      className={classNames(className, { circular, selected })}
      onClick={() => onClick()}
      color={selected ? FadedColors.states.active : FadedColors.primary}
    >
      <div className="text-high">{children}</div>
    </StyledButton>
  )
}

export default SelectionButton
