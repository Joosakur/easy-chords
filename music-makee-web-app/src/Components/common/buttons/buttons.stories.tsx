import React from 'react'
import ActionButton from './ActionButton'
import {FixedSpacing} from '../layout/flex'
import {faAngleLeft, faAngleRight, faCog, faFileImport} from '@fortawesome/free-solid-svg-icons'
import {action} from '@storybook/addon-actions'
import {H2, H3} from '../typography'
import {Gap} from '../layout/whie-space'
import PadButton from './PadButton'
import {Colors} from '../style-constants'
import styled from 'styled-components'
import {StorySegment} from '../../../utils/story-utils'
import SelectionButton from './SelectionButton'
import CircleActionButton from './CircleActionButton'

const onClick = action('button clicked')
const onMouseDown = action('mouse down')

const Row = styled.div`
  display: flex;
  flex-direction: row;
  >* {
    flex-grow: 2;
    &:first-child {
      flex-grow: 1;
    }
  }
`


const PadGrid = styled.div`
  width: 30rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 2em;
`

const SelectionGrid = styled.div`
  display: grid;
  width: fit-content;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 0.4em;
  font-size: 0.66rem;
`

const SelectionGrid2 = styled.div`
  display: grid;
  width: fit-content;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2em;
  font-size: 0.66rem;
`

export default {
  title: 'atoms'
}

export const buttons = () => (
  <Row>
    <StorySegment color={Colors.grey.darker}>
      <div>
        <H3>SelectionButton (default, selected)</H3>
        <SelectionGrid>
          <SelectionButton onClick={onClick}>
            <span>7</span>
          </SelectionButton>
          <SelectionButton onClick={onClick} selected>
            <span>major</span>
          </SelectionButton>
          <SelectionButton onClick={onClick}>
            <span>maj7</span>
          </SelectionButton>
        </SelectionGrid>
        <Gap/>
  
        <label>circular (default, selected)</label>
        <Gap size='s'/>
        <SelectionGrid2>
          <SelectionButton onClick={onClick} circular>
            <span>E♭</span>
          </SelectionButton>
          <SelectionButton onClick={onClick} circular selected>
            <span>F♯</span>
          </SelectionButton>
        </SelectionGrid2>
      </div>
      <Gap/>
    
      <div>
        <H3>CircleActionButton (default, disabled)</H3>
        <FixedSpacing>
          <CircleActionButton onClick={onClick} altText='decrease' icon={faAngleLeft}/>
          <CircleActionButton onClick={onClick} altText='increase' icon={faAngleRight} disabled/>
        </FixedSpacing>
      </div>
    </StorySegment>
    
    <StorySegment color={Colors.grey.dark}>
      <div>
        <H3>ActionButton</H3>
        <label>default</label>
        <Gap size='s'/>
        <FixedSpacing>
          <ActionButton onClick={onClick} text='Open editor'/>
          <ActionButton onClick={onClick} text='Import' icon={faFileImport}/>
          <ActionButton onClick={onClick} text='Settings' hideText icon={faCog}/>
        </FixedSpacing>
        
        <Gap/>
        
        <label>disabled</label>
        <Gap size='s'/>
        <FixedSpacing>
          <ActionButton onClick={onClick} text='Open editor' disabled/>
          <ActionButton onClick={onClick} text='Import' icon={faFileImport} disabled/>
          <ActionButton onClick={onClick} text='Settings' hideText icon={faCog} disabled/>
        </FixedSpacing>
      </div>
      
      <Gap size='L'/>
      
      <H3>PadButton (default, selected, empty)</H3>
      <PadGrid>
        <PadButton onMouseDown={onMouseDown} text='Gmaj7'/>
        <PadButton onMouseDown={onMouseDown} selected text='C add9 / G'/>
        <PadButton onMouseDown={onMouseDown} empty text=''/>
      </PadGrid>
    </StorySegment>
    <Gap/>
  </Row>
)
