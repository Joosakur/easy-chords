import React from 'react'
import { IntervalNumber } from '../../../types'
import styled from 'styled-components'
import { SuperScript } from '../../common/typography'
import SelectionButton from '../../common/buttons/SelectionButton'

const Wrapper = styled.div`
  position: relative;
  width: 26rem;
  height: 26rem;
`

const ButtonWrapper = styled.div<{ pos: IntervalNumber }>`
  font-size: 1.1em;
  position: absolute;
  top: ${(p) =>
    `calc(${100 * (0.5 - 0.43 * Math.sin(Math.PI / 2 - (p.pos * Math.PI) / 6.0))}% - 1.3em)`};
  left: ${(p) =>
    `calc(${100 * (0.5 + 0.43 * Math.cos(Math.PI / 2 - (p.pos * Math.PI) / 6.0))}% - 1.3em)`};
`

const CenterSlotWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface RootSelectorProps {
  root?: IntervalNumber
  onChange: (root: IntervalNumber) => any
  children?: React.ReactNode
}

function RootSelector({ root, onChange, children }: RootSelectorProps) {
  const symbols = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F']

  return (
    <Wrapper>
      <CenterSlotWrapper>{children}</CenterSlotWrapper>
      {symbols.map((symbol, index) => (
        <ButtonWrapper pos={index as IntervalNumber} key={index}>
          <SelectionButton
            onClick={() => onChange(((index * 7) % 12) as IntervalNumber)}
            selected={(index * 7) % 12 === root}
            circular
          >
            <div>
              <span>{symbol[0]}</span>
              {symbol.length > 1 && <SuperScript>{symbol[1]}</SuperScript>}
            </div>
          </SelectionButton>
        </ButtonWrapper>
      ))}
    </Wrapper>
  )
}

export default RootSelector
