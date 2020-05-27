import React from 'react';
import {Resizer} from '../../../utils/story-utils'
import Octave from './Octave'

export default {
  title: 'molecules/piano'
}

export const octave = () => (
  <Resizer style={{height: '20rem'}}>
    <Octave octave={4} />
  </Resizer>
)
