import React, {useContext} from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons'
import {Colors, SPACING_LENGTHS} from './common/style-constants'
import {ChordMapContext} from '../state/chord-map-context'
import ChordEditor from './left-sidebar/ChordEditor'
import {H2} from './common/typography'
import CircleActionButton from './common/buttons/CircleActionButton'

const SidebarContainer = styled.div`
  background: ${Colors.grey.darker};
  display: none;
  z-index: 2;
  max-height: 100%;
  
  &.open {
    min-width: 30rem;
    display: flex;
    flex-direction: column;
  }
`

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
  z-index: 3;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5rem;
  margin-top: -${SPACING_LENGTHS.m};
  padding: ${SPACING_LENGTHS.m} ${SPACING_LENGTHS.m} 0;
  flex-shrink: 0;
`

function LeftSidebar() {
  const { editorOpen, setEditorOpen } = useContext(ChordMapContext)
  return editorOpen ? (
    <SidebarContainer className={classNames({ open: editorOpen })}>
      <InnerWrapper>
        <TopRow>
          <H2 fitted>Chord Editor</H2>
          <CircleActionButton
            icon={faAngleLeft}
            altText='Close sidebar'
            onClick={() => setEditorOpen(false)}
            color={Colors.grey.darker}
          />
        </TopRow>
        <ChordEditor/>
        <div style={{ flexGrow: 1 }}/>
      </InnerWrapper>
    </SidebarContainer>
  ) : null
}

export default LeftSidebar
