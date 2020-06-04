import React from 'react'
import { Dropdown as SemanticDropdown, StrictDropdownProps } from 'semantic-ui-react'
import styled from 'styled-components'
import { Colors } from './style-constants'

import 'semantic-ui-dropdown/dropdown.css'

const StyledDropdown = styled(SemanticDropdown)`
  &.ui.selection.dropdown {
    padding: 0.75em 2em 0.75em 1em;
    min-height: unset;
    height: calc(2.75rem - 1.5em);
    color: ${Colors.grey.dark};

    > div.text {
      color: rgba(0, 0, 0, 0.87);
    }

    .menu.visible {
      display: block;
      width: 100%;
      min-width: 100%;
      max-height: 20rem;
    }

    @media screen and (max-width: 650px) {
      min-width: 8rem;
    }
  }
`

interface DropdownProps<T extends boolean | number | string> {
  children?: React.ReactNode
  placeholder?: string
  options?: { value: T; text: string }[]
  value?: T
  onChange?: (value?: T) => any
}

function Dropdown<T extends boolean | number | string>({
  children,
  placeholder,
  options,
  value,
  onChange
}: DropdownProps<T>) {
  return (
    <StyledDropdown
      className={'selection'}
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={(e: any, data: StrictDropdownProps) => onChange && onChange(data.value as T)}
    >
      {children}
    </StyledDropdown>
  )
}

export default React.memo(Dropdown)
