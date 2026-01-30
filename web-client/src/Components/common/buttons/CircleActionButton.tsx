import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { shade, tint } from 'polished'
import styled from 'styled-components'
import { Colors, FadedColors } from '../style-constants'

interface StyledButtonProps {
  color: string
}

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.5em;
  width: 1.5em;

  font-size: 1.2rem;

  border: none;
  border-radius: 100%;
  outline: none;
  cursor: pointer;

  background: ${(P) => P.color};
  box-shadow: 2px 2px 1px ${(P) => shade(0.5, P.color)}, 3px 4px 3px 1px rgba(0, 0, 0, 0.2),
    inset 1px 1px 2px rgba(255, 255, 255, 0.1), inset 1px 2px 0.6rem rgba(255, 255, 255, 0.1);

  &:hover {
    background: ${(P) => tint(0.04, P.color)};
  }

  &:active {
    background: ${(P) => shade(0.06, P.color)};
    box-shadow: 0 1px 0 ${(P) => shade(0.5, P.color)}, 1px 2px 1px 1px rgba(0, 0, 0, 0.15),
      inset 1px 1px 2px rgba(255, 255, 255, 0.1), inset 1px 2px 0.6rem rgba(255, 255, 255, 0.1);

    margin-top: 1px;
    margin-bottom: -1px;
  }

  &.disabled,
  &.disabled:hover,
  &.disabled:active {
    background: ${Colors.grey.dark};
    cursor: unset;
  }
`

interface CircleActionButtonProps {
  onClick: () => any
  icon: IconProp
  altText: string
  disabled?: boolean
  color?: string

  className?: string
}

function CircleActionButton({
  onClick,
  icon,
  altText,
  disabled,
  color = FadedColors.secondary,
  className,
}: CircleActionButtonProps) {
  return (
    <StyledButton
      className={classNames(className, { disabled })}
      onClick={() => onClick()}
      aria-label={altText}
      color={color}
    >
      <FontAwesomeIcon icon={icon} className={disabled ? 'text-disabled' : 'text-high'} />
    </StyledButton>
  )
}

export default CircleActionButton
