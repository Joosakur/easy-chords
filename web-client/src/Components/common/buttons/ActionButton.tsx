import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Colors, SPACING_LENGTHS } from '../style-constants'
import classNames from 'classnames'
import { FixedSpacing } from '../layout/flex'
import { shade, tint } from 'polished'

interface StyledButtonProps {
  color: string
  hideTextThreshold?: string
}
const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.75rem;
  padding: 0 ${SPACING_LENGTHS.s};

  font-size: 1.2rem;
  font-weight: 600;

  background: ${(p) => p.color};
  border: none;
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0.4rem 2px rgba(0, 0, 0, 0.4);

  &.disabled,
  &.disabled:hover,
  &.disabled:active {
    background: ${Colors.grey.darker};
    cursor: unset;
  }
  &:hover {
    background: ${(p) => tint(0.06, p.color)};
  }
  &:active {
    background: ${(p) => shade(0.06, p.color)};
  }

  ${(p) =>
    p.hideTextThreshold
      ? `
    @media screen and (max-width: ${p.hideTextThreshold}) {
      span {
        display: none;
      }
      svg {
        margin: 0
      }
    }
  `
      : ''}
`

interface ActionButtonProps {
  onClick: () => any
  text: string
  icon?: IconProp
  hideText?: boolean | string
  color?: string
  disabled?: boolean

  className?: string
}

function ActionButton({
  onClick,
  text,
  icon,
  color = Colors.grey.darker,
  hideText = false,
  disabled,
  className
}: ActionButtonProps) {
  return (
    <StyledButton
      className={classNames(className, { disabled })}
      aria-label={text}
      onClick={() => onClick()}
      color={color}
      hideTextThreshold={typeof hideText === 'string' ? hideText : undefined}
    >
      <FixedSpacing spacing="s" className={disabled ? 'text-disabled' : 'text-high'}>
        {icon && <FontAwesomeIcon icon={icon} />}
        {hideText !== true && <span>{text}</span>}
      </FixedSpacing>
    </StyledButton>
  )
}

export default ActionButton
