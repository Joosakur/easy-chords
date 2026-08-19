import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import CircleActionButton from '../common/buttons/CircleActionButton'
import { FixedSpacing } from '../common/layout/flex'

const TransposeSpan = styled.span`
  font-weight: bold;
  white-space: nowrap;

  /* Keeps the buttons still while the value switches between -24 and +24 */
  flex: 0 0 2.5em;
  text-align: center;
  font-variant-numeric: tabular-nums;
`

interface TransposeSelectorProps {
  transpose: number
  min: number
  max: number
  onChange: (val: number) => void
}

function TransposeSelector({ transpose, min, max, onChange }: TransposeSelectorProps) {
  return (
    <FixedSpacing $spacing="s">
      <CircleActionButton
        icon={faMinus}
        altText="Transpose down"
        onClick={() => onChange(transpose - 1)}
        disabled={transpose <= min}
      />

      <TransposeSpan className="text-high">
        {transpose > 0 ? `+${transpose}` : transpose}
      </TransposeSpan>

      <CircleActionButton
        icon={faPlus}
        altText="Transpose up"
        onClick={() => onChange(transpose + 1)}
        disabled={transpose >= max}
      />
    </FixedSpacing>
  )
}

export default TransposeSelector
