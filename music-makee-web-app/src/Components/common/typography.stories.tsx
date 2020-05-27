import React from 'react';
import {H1, H2, H3, SubScript, SuperScript} from './typography'
import {LoremParagraph, StorySegment} from '../../utils/story-utils'
import {Gap} from './layout/whie-space'
import {Colors} from './style-constants'

export default {
  title: 'typography'
}

export const headings = () => (
  <StorySegment color={Colors.grey.darker}>
    <H1>EasyChords</H1>
    <Gap/>
    
    <H2>Heading 2</H2>
    <LoremParagraph/>
    <Gap/>
    
    <H3>Heading 3</H3>
    <LoremParagraph/>
    <LoremParagraph/>
    <Gap/>
  </StorySegment>
)

export const subAndSuperScripts = () => (
  <StorySegment color={Colors.grey.darker}>
    <div className='text-high'>
      <span>C</span><SuperScript>7</SuperScript>
    </div>
    <Gap/>
  
    <div className='text-high'>
      <span>3</span><SubScript>min</SubScript>
    </div>
    <Gap/>
  </StorySegment>
)
