import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { closeSettings, selectIsSettingsOpen } from '../state/ui/ui-slice'
import CircleActionButton from './common/buttons/CircleActionButton'
import { Gap } from './common/layout/white-space'
import { Colors, SPACING_LENGTHS } from './common/style-constants'
import { H2 } from './common/typography'
import Settings from './right-sidebar/Settings'

const slideIn = keyframes`
  from {
    transform: translateX(30rem);
  }
  to {
    transform: translateX(0);
  }
`

const slideOut = keyframes`
  from {
    transform: translateX(0);
    visibility: visible;
  }
  to {
    transform: translateX(30rem);
    visibility: hidden;
  }
`

const SidebarContainer = styled.div`
  background: ${Colors.grey.darkest};
  width: 27rem;
  padding: ${SPACING_LENGTHS.m};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;

  animation: 250ms ${slideOut} ease-out forwards;
  visibility: hidden;

  &.initial {
    animation: none;
  }

  &.open {
    animation: 250ms ${slideIn} ease-out forwards;
    visibility: visible;
    box-shadow: -20px 0 16px -15px rgba(0, 0, 0, 0.7),
      inset 14px 0 5px -10px rgba(255, 255, 255, 0.22);
  }
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5rem;
  margin-top: -${SPACING_LENGTHS.m};
`

function RightSidebar() {
  const dispatch = useDispatch()
  const open = useSelector(selectIsSettingsOpen)

  const [initial, setInitial] = useState<boolean>(true)
  useEffect(() => {
    if (open) setInitial(false)
  }, [open])

  return (
    <SidebarContainer className={classNames({ open, initial })}>
      <TopRow>
        <CircleActionButton
          icon={faAngleRight}
          altText="Close sidebar"
          onClick={() => dispatch(closeSettings())}
          color={Colors.grey.darker}
        />
        <H2 fitted>Settings</H2>
      </TopRow>
      <Gap />
      <Settings />
    </SidebarContainer>
  )
}

export default RightSidebar
