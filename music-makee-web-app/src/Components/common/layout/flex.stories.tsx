import React from 'react';
import { boolean, select } from '@storybook/addon-knobs'
import styled from 'styled-components'
import {FixedSpacing} from './flex'

export default {
  title: 'layout/flex'
}

const Element = styled.div`
  height: 30px;
  width: 100px;
  background: #20628e;
`

export const fixedSpacing = () => (
  <FixedSpacing
    column={boolean("column", false)}
    spacing={select('spacing', ['xs', 's', 'm', 'L', 'XL'], 'm')}
  >
    <Element/>
    <Element/>
    <Element/>
  </FixedSpacing>
)
