import React from 'react';
import styled from 'styled-components'
import {H3} from './typography'
import {Gap} from './layout/whie-space'
import {FixedSpacing} from './layout/flex'
import {Colors, FadedColors} from './style-constants'
import {StorySegment} from '../../utils/story-utils'

export default {
  title: 'colors'
}

const Row = styled.div`
  display: flex;
  >* {
    flex-grow: 1;
  }
`


interface ColorCircleProps {
  color: string
  border?: string
}
const ColorCircle = styled.div<ColorCircleProps>`
  height: 90px;
  width: 90px;
  border-radius: 100%;
  background-color: ${p => p.color};
  ${p => p.border ? `border: 1px solid ${p.border};` : ''}
`

const ColorPreview = (props: { color: string, label: string, border?: string }) => (
  <FixedSpacing column spacing='s'>
    <ColorCircle color={props.color} border={props.border}/>
    <label>{props.label}</label>
  </FixedSpacing>
)

export const palette = () => (
  <Row>
    <StorySegment color={Colors.grey.dark}>
      <H3>Greyscale</H3>
      <FixedSpacing>
        <ColorPreview color={Colors.grey.darker} label='darker'/>
        <ColorPreview color={Colors.grey.dark} border={Colors.grey.darker} label='dark'/>
      </FixedSpacing>
      <Gap/>

      <H3>Primaries</H3>
      <FixedSpacing>
        <ColorPreview color={Colors.primary} label='primary'/>
        <ColorPreview color={Colors.secondary} label='secondary'/>
      </FixedSpacing>
      <Gap/>
      
      <H3>States</H3>
      <FixedSpacing>
        <ColorPreview color={Colors.states.active} label='Active / Positive'/>
      </FixedSpacing>
      <Gap/>
  
      <H3>Interval Associations</H3>
      <FixedSpacing wrap>
        <ColorPreview color={Colors.interval[0]} label='1st / 8th'/>
        <ColorPreview color={Colors.interval[1]} label='min 2nd'/>
        <ColorPreview color={Colors.interval[2]} label='maj 2nd'/>
        <ColorPreview color={Colors.interval[3]} label='min 3rd'/>
        <ColorPreview color={Colors.interval[4]} label='maj 3rd'/>
        <ColorPreview color={Colors.interval[5]} label='4th'/>
        <ColorPreview color={Colors.interval[6]} label='dim 5th'/>
        <ColorPreview color={Colors.interval[7]} label='5th'/>
        <ColorPreview color={Colors.interval[8]} label='aug 5th'/>
        <ColorPreview color={Colors.interval[9]} label='maj 6th'/>
        <ColorPreview color={Colors.interval[10]} label='min 7th'/>
        <ColorPreview color={Colors.interval[11]} label='maj 7th'/>
      </FixedSpacing>
      <Gap/>
    </StorySegment>
    
    <StorySegment color={Colors.grey.darker}>
      <H3>Greyscale</H3>
      <FixedSpacing>
        <ColorPreview color={Colors.grey.darker} border={Colors.grey.dark} label='darker'/>
        <ColorPreview color={Colors.grey.dark} label='dark'/>
      </FixedSpacing>
      <Gap/>
  
      <H3>Primaries</H3>
      <FixedSpacing>
        <ColorPreview color={FadedColors.primary} label='primary'/>
        <ColorPreview color={FadedColors.secondary} label='secondary'/>
      </FixedSpacing>
      <Gap/>
      
      <H3>States</H3>
      <FixedSpacing>
        <ColorPreview color={FadedColors.states.active} label='Active / Positive'/>
      </FixedSpacing>
      <Gap/>
  
      <H3>Interval Associations</H3>
      <FixedSpacing wrap>
        <ColorPreview color={Colors.interval[0]} label='1st / 8th'/>
        <ColorPreview color={Colors.interval[1]} label='min 2nd'/>
        <ColorPreview color={Colors.interval[2]} label='maj 2nd'/>
        <ColorPreview color={Colors.interval[3]} label='min 3rd'/>
        <ColorPreview color={Colors.interval[4]} label='maj 3rd'/>
        <ColorPreview color={Colors.interval[5]} label='4th'/>
        <ColorPreview color={Colors.interval[6]} label='dim 5th'/>
        <ColorPreview color={Colors.interval[7]} label='5th'/>
        <ColorPreview color={Colors.interval[8]} label='aug 5th'/>
        <ColorPreview color={Colors.interval[9]} label='maj 6th'/>
        <ColorPreview color={Colors.interval[10]} label='min 7th'/>
        <ColorPreview color={Colors.interval[11]} label='maj 7th'/>
      </FixedSpacing>
      <Gap/>
    </StorySegment>
  
  </Row>
)
