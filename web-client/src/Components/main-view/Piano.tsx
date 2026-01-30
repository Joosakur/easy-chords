import {
  faAngleDown,
  faAngleUp,
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { playChord, setSustainPedal } from '../../state/actions'
import { selectSustainPedal } from '../../state/piano/piano-slice'
import { selectSettings } from '../../state/settings/settings-slice'
import { selectIsEditorOpen } from '../../state/ui/ui-slice'
import CircleActionButton from '../common/buttons/CircleActionButton'
import PadButton from '../common/buttons/PadButton'
import { FixedSpacing } from '../common/layout/flex'
import { Colors, SPACING_LENGTHS } from '../common/style-constants'
import Octave from './piano/Octave'
import { RootDragLayerHorizontal } from './piano/RootButton'

const PianoWrapper = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  min-height: 15rem;

  display: flex;
  flex-direction: column;

  &.collapsed {
    min-height: unset;
    height: fit-content;
  }
`

const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${Colors.grey.darker};
  padding: ${SPACING_LENGTHS.s} ${SPACING_LENGTHS.s} ${SPACING_LENGTHS.xs};
  background: linear-gradient(${Colors.grey.dark} 5%, ${Colors.grey.darker} 20%, #39271b 100%);
  box-shadow: inset 0 6px 5px -5px rgba(255, 255, 255, 0.34);
`

const OctavesRow = styled.div`
  flex-grow: 1;
  border-top: 6px #39271b solid;
  display: flex;
  padding-bottom: ${SPACING_LENGTHS.s} 0;
  background: ${Colors.grey.darker};
`

const calculateOctaveCount = (width: number): number => {
  if (width < 400) return 0

  return Math.min(7, Math.round(width / 350))
}

function Piano() {
  const dispatch = useDispatch()
  const { midiOutput } = useSelector(selectSettings)
  const editorOpen = useSelector(selectIsEditorOpen)

  const sustainPedal = useSelector(selectSustainPedal)

  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [octaves, setOctaves] = useState<number>(3)
  const [centerOctave, setCenterOctave] = useState<number>(5)
  const selfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleResize() {
      const width = selfRef.current?.offsetWidth ?? 0
      const newOctaves = calculateOctaveCount(width)
      setOctaves((prev) => (newOctaves !== prev ? newOctaves : prev))
    }

    handleResize() // Initial calculation
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (octaves === 0) return null

  const firstOctave = centerOctave - Math.floor((octaves - 1) / 2)
  const octaveArray = new Array<number>(octaves).fill(0).map((_, i) => i + firstOctave)
  return (
    <PianoWrapper ref={selfRef} className={classNames({ collapsed })}>
      <ControlRow>
        {!collapsed ? (
          <>
            <CircleActionButton
              disabled={firstOctave <= 1}
              onClick={() => setCenterOctave(centerOctave - 1)}
              icon={faCaretLeft}
              altText={'Scroll piano left'}
            />

            <FixedSpacing>
              {midiOutput && (
                <PadButton
                  text="Sustain [Space]"
                  toggle
                  selected={sustainPedal}
                  onMouseDown={() => dispatch(setSustainPedal(!sustainPedal))}
                  color={Colors.grey.darker}
                  thin
                />
              )}

              {editorOpen && (
                <PadButton
                  text="Play Chord"
                  onMouseDown={() => dispatch(playChord())}
                  color={Colors.primary}
                  thin
                />
              )}
            </FixedSpacing>
          </>
        ) : (
          <div style={{ flexGrow: 1 }} />
        )}
        <FixedSpacing>
          {!collapsed && (
            <CircleActionButton
              disabled={firstOctave + octaves >= 9}
              onClick={() => setCenterOctave(centerOctave + 1)}
              icon={faCaretRight}
              altText={'Scroll piano right'}
            />
          )}
          <CircleActionButton
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? faAngleUp : faAngleDown}
            altText={collapsed ? 'Show piano' : 'Hide piano'}
            color={Colors.grey.darker}
          />
        </FixedSpacing>
      </ControlRow>
      {!collapsed && (
        <OctavesRow>
          {octaveArray.map((octave) => (
            <Octave key={octave} octave={octave} />
          ))}
        </OctavesRow>
      )}
      <RootDragLayerHorizontal />
    </PianoWrapper>
  )
}

export default Piano
