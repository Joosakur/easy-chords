import type { Meta, StoryObj } from '@storybook/react'
import styled from 'styled-components'
import { FixedSpacing } from './flex'

const Element = styled.div`
  height: 30px;
  width: 100px;
  background: #20628e;
`

const meta: Meta<typeof FixedSpacing> = {
  title: 'layout/flex',
  component: FixedSpacing,
  argTypes: {
    column: { control: 'boolean' },
    spacing: {
      control: 'select',
      options: ['xs', 's', 'm', 'L', 'XL']
    }
  }
}

export default meta
type Story = StoryObj<typeof FixedSpacing>

export const fixedSpacing: Story = {
  args: {
    column: false,
    spacing: 'm'
  },
  render: (args) => (
    <FixedSpacing {...args}>
      <Element />
      <Element />
      <Element />
    </FixedSpacing>
  )
}
