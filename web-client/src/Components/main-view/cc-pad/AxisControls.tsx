import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { CC_PAD } from '../../../config/constants'
import {
  type CcAxis,
  type CcAxisState,
  setAxisCc,
  setAxisEnabled,
  setAxisMax,
  setAxisMin,
  setAxisSize,
} from '../../../state/cc-pad/cc-pad-slice'
import CircleActionButton from '../../common/buttons/CircleActionButton'
import SelectionButton from '../../common/buttons/SelectionButton'
import { Input } from '../../common/Input'
import { FixedSpacing } from '../../common/layout/flex'

const sizes: number[] = [...CC_PAD.SIZE_PERCENTS]

const NumberInput = styled(Input)`
  width: 4.5rem;
  text-align: center;
`

const AxisLabel = styled.span`
  font-weight: bold;
  flex: 0 0 1.5rem;
`

const SizeLabel = styled.span`
  flex: 0 0 3rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
`

type AxisAction = ActionCreatorWithPayload<{ axis: CcAxis; value: number }>

interface NumberFieldProps {
  label: string
  value: number
  axis: CcAxis
  action: AxisAction
  dataTest: string
}

function NumberField({ label, value, axis, action, dataTest }: NumberFieldProps) {
  const dispatch = useDispatch()

  return (
    <FixedSpacing $spacing="xs">
      <label className="text-medium">{label}</label>
      <NumberInput
        type="number"
        min={CC_PAD.MIN}
        max={CC_PAD.MAX}
        value={String(value)}
        data-test={dataTest}
        onChange={(_e, data) => {
          if (data.value !== '') dispatch(action({ axis, value: Number(data.value) }))
        }}
      />
    </FixedSpacing>
  )
}

interface AxisControlsProps {
  axis: CcAxis
  config: CcAxisState
}

function AxisControls({ axis, config }: AxisControlsProps) {
  const dispatch = useDispatch()
  const name = axis.toUpperCase()
  const sizeIndex = sizes.indexOf(config.sizePercent)

  const stepSize = (offset: number) =>
    dispatch(
      setAxisSize({
        axis,
        value: sizes[Math.min(sizes.length - 1, Math.max(0, sizeIndex + offset))],
      }),
    )

  return (
    <FixedSpacing $spacing="m" $wrap>
      <AxisLabel className="text-high">{name}</AxisLabel>

      <SelectionButton
        selected={config.enabled}
        onClick={() => dispatch(setAxisEnabled({ axis, value: !config.enabled }))}
        data-test={`cc-enabled-${axis}`}
      >
        {config.enabled ? 'On' : 'Off'}
      </SelectionButton>

      <NumberField
        label="CC"
        value={config.cc}
        axis={axis}
        action={setAxisCc}
        dataTest={`cc-number-${axis}`}
      />
      <NumberField
        label="Min"
        value={config.min}
        axis={axis}
        action={setAxisMin}
        dataTest={`cc-min-${axis}`}
      />
      <NumberField
        label="Max"
        value={config.max}
        axis={axis}
        action={setAxisMax}
        dataTest={`cc-max-${axis}`}
      />

      <FixedSpacing $spacing="s">
        <label className="text-medium">Size</label>
        <CircleActionButton
          icon={faMinus}
          altText={`Shrink ${name} axis`}
          onClick={() => stepSize(-1)}
          disabled={sizeIndex <= 0}
        />
        <SizeLabel className="text-high" data-test={`cc-size-${axis}`}>
          {config.sizePercent}%
        </SizeLabel>
        <CircleActionButton
          icon={faPlus}
          altText={`Grow ${name} axis`}
          onClick={() => stepSize(1)}
          disabled={sizeIndex >= sizes.length - 1}
        />
      </FixedSpacing>
    </FixedSpacing>
  )
}

export default AxisControls
