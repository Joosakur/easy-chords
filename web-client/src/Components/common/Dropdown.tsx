import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Colors } from './style-constants'

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`

const DropdownButton = styled.button`
  padding: 0.75em 2.5em 0.75em 1em;
  min-height: 2.75rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.3rem;
  background: #fff;
  color: ${Colors.grey.dark};
  font-size: 1em;
  text-align: left;
  cursor: pointer;
  position: relative;
  min-width: 10rem;

  &:hover {
    border-color: rgba(34, 36, 38, 0.35);
  }

  &:focus {
    border-color: #96c8da;
    outline: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: 1em;
    top: 50%;
    transform: translateY(-50%);
    border-left: 0.35em solid transparent;
    border-right: 0.35em solid transparent;
    border-top: 0.35em solid rgba(0, 0, 0, 0.6);
  }

  @media screen and (max-width: 650px) {
    min-width: 8rem;
  }
`

const DropdownMenuContainer = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  background: #fff;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`

const SelectDropdown = styled.select`
  padding: 0.75em 2em 0.75em 1em;
  min-height: 2.75rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.3rem;
  background: #fff;
  color: ${Colors.grey.dark};
  font-size: 1em;
  cursor: pointer;
  min-width: 10rem;

  &:focus {
    border-color: #96c8da;
    outline: none;
  }

  @media screen and (max-width: 650px) {
    min-width: 8rem;
  }
`

interface DropdownProps<T extends boolean | number | string> {
  children?: React.ReactNode
  placeholder?: string
  options?: { value: T; text: string }[]
  value?: T
  onChange?: (value?: T) => void
}

function Dropdown<T extends boolean | number | string>({
  children,
  placeholder,
  options,
  value,
  onChange
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // If options provided, use native select
  if (options && !children) {
    return (
      <SelectDropdown
        value={value !== undefined ? String(value) : ''}
        onChange={(e) => {
          const val = e.target.value
          const option = options.find((o) => String(o.value) === val)
          onChange?.(option?.value)
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.text}
          </option>
        ))}
      </SelectDropdown>
    )
  }

  // If children provided, use custom dropdown menu
  return (
    <DropdownContainer ref={containerRef}>
      <DropdownButton type="button" onClick={() => setOpen(!open)}>
        {placeholder || 'Select...'}
      </DropdownButton>
      <DropdownMenuContainer $open={open} onClick={() => setOpen(false)}>
        {children}
      </DropdownMenuContainer>
    </DropdownContainer>
  )
}

export default React.memo(Dropdown) as typeof Dropdown

// Menu components
export const DropdownMenu = styled.div`
  padding: 0.5rem 0;
`

export const DropdownHeader = styled.div`
  padding: 0.5rem 1rem;
  font-weight: 700;
  font-size: 0.85em;
  color: rgba(0, 0, 0, 0.85);
  text-transform: uppercase;
`

const DropdownItemBase = styled.div<{ disabled?: boolean }>`
  padding: 0.65rem 1rem;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  color: rgba(0, 0, 0, 0.87);

  &:hover {
    background: ${({ disabled }) => (disabled ? 'transparent' : 'rgba(0, 0, 0, 0.05)')};
  }
`

const DropdownItemDescription = styled.span`
  color: rgba(0, 0, 0, 0.4);
  font-size: 0.9em;
  margin-left: 0.5rem;
`

interface DropdownItemProps {
  children?: React.ReactNode
  text?: string
  description?: string
  disabled?: boolean
  onClick?: () => void
}

export function DropdownItem({
  children,
  text,
  description,
  disabled,
  onClick
}: DropdownItemProps) {
  return (
    <DropdownItemBase disabled={disabled} onClick={disabled ? undefined : onClick}>
      {text || children}
      {description && <DropdownItemDescription>- {description}</DropdownItemDescription>}
    </DropdownItemBase>
  )
}

export const DropdownDivider = styled.div`
  height: 1px;
  margin: 0.5rem 0;
  background: rgba(34, 36, 38, 0.1);
`
