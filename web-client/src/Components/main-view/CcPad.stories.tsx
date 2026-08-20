import { action } from 'storybook/actions'
import styled from 'styled-components'
import { initialCcPadState } from '../../state/cc-pad/cc-pad-slice'
import { Colors } from '../common/style-constants'
import AxisControls from './cc-pad/AxisControls'
import PadSurface from './cc-pad/PadSurface'

export default {
  title: 'molecules/CcPad',
}

const MainViewBackground = styled.div`
  position: absolute;
  inset: 0;
  padding: 2rem;
  background-color: ${Colors.grey.dark};
  display: flex;
  flex-direction: column;
`

const pointerMoved = action('pad pointer moved')

export const padSurface = () => (
  <MainViewBackground>
    <PadSurface widthPercent={100} heightPercent={100} xEnabled yEnabled onMove={pointerMoved} />
  </MainViewBackground>
)

export const padSurfaceWithOneAxis = () => (
  <MainViewBackground>
    <PadSurface
      widthPercent={100}
      heightPercent={50}
      xEnabled
      yEnabled={false}
      onMove={pointerMoved}
    />
  </MainViewBackground>
)

export const axisControls = () => (
  <MainViewBackground>
    <AxisControls axis="x" config={initialCcPadState.x} />
    <AxisControls axis="y" config={{ ...initialCcPadState.y, enabled: false, sizePercent: 50 }} />
  </MainViewBackground>
)
