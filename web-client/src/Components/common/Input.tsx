import styled from 'styled-components'
import { Colors } from './style-constants'

interface InputProps {
  value?: string
  placeholder?: string
  fluid?: boolean
  type?: 'text' | 'number'
  min?: number
  max?: number
  className?: string
  'data-test'?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => void
}

const StyledInput = styled.input<{ $fluid?: boolean }>`
  padding: 0.6em 1em;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.3rem;
  font-size: 1em;
  color: ${Colors.grey.dark};
  background: #fff;
  outline: none;
  width: ${({ $fluid }) => ($fluid ? '100%' : 'auto')};

  &:focus {
    border-color: #85b7d9;
    box-shadow: 0 0 0 1px #85b7d9 inset;
  }

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`

export function Input({
  value,
  placeholder,
  fluid,
  type = 'text',
  min,
  max,
  className,
  'data-test': dataTest,
  onChange,
}: InputProps) {
  return (
    <StyledInput
      type={type}
      value={value}
      placeholder={placeholder}
      min={min}
      max={max}
      $fluid={fluid}
      className={className}
      data-test={dataTest}
      onChange={(e) => onChange?.(e, { value: e.target.value })}
    />
  )
}

export default Input
