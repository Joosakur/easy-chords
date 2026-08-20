import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { padPointerMoved } from '../../state/cc-pad/cc-pad-saga-actions'
import { selectCcPadAxes, selectCcPadValue } from '../../state/cc-pad/cc-pad-slice'
import { selectIsUsingMidi } from '../../state/settings/settings-slice'
import { Gap } from '../common/layout/white-space'
import { Colors, SPACING_LENGTHS } from '../common/style-constants'
import { H3 } from '../common/typography'
import AxisControls from './cc-pad/AxisControls'
import PadSurface from './cc-pad/PadSurface'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  padding: ${SPACING_LENGTHS.m} 0;
`

const PadArea = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 0;
  align-items: center;
  justify-content: center;
`

const Readout = styled.div`
  position: absolute;
  top: ${SPACING_LENGTHS.s};
  left: ${SPACING_LENGTHS.m};
  font-size: 1.4rem;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
`

const Warning = styled.div`
  background-color: ${Colors.states.error};
  border-radius: 8px;
  padding: 8px;
  margin-bottom: ${SPACING_LENGTHS.s};
`

function CcPad() {
  const dispatch = useDispatch()
  const axes = useSelector(selectCcPadAxes)
  const value = useSelector(selectCcPadValue)
  const usingMidi = useSelector(selectIsUsingMidi)

  const onMove = useCallback(
    (position: Parameters<typeof padPointerMoved>[0]) => dispatch(padPointerMoved(position)),
    [dispatch],
  )

  return (
    <Container>
      {!usingMidi && (
        <Warning>
          <H3>Control Change needs external MIDI</H3>
          <p className="text-high">
            The built-in browser piano cannot receive CC. Enable external MIDI in Settings to send
            from this pad.
          </p>
        </Warning>
      )}

      <PadArea>
        <PadSurface
          widthPercent={axes.x.sizePercent}
          heightPercent={axes.y.sizePercent}
          xEnabled={axes.x.enabled}
          yEnabled={axes.y.enabled}
          onMove={onMove}
        >
          <Readout className="text-medium">
            <div data-test="cc-value-x">
              X · CC {axes.x.cc}: <span className="text-high">{value.x ?? '—'}</span>
            </div>
            <div data-test="cc-value-y">
              Y · CC {axes.y.cc}: <span className="text-high">{value.y ?? '—'}</span>
            </div>
          </Readout>
        </PadSurface>
      </PadArea>

      <Gap $size="m" />
      <AxisControls axis="x" config={axes.x} />
      <Gap $size="s" />
      <AxisControls axis="y" config={axes.y} />
    </Container>
  )
}

export default React.memo(CcPad)
