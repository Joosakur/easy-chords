import React from 'react'
import QualitySelector from './chord-editor/QualitySelector'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Colors } from '../common/style-constants'
import RootSelector from './chord-editor/RootSelector'
import VoicingEditor from './chord-editor/VoicingEditor'
import OctaveSelector from './chord-editor/OctaveSelector'

export default {
  title: 'molecules/ChordEditor'
}

const voicingChanged = action('voicing changed')
const rootChanged = action('root changed')
const octaveChange = action('octave changed')

const SidebarBackground = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 30rem;
  background-color: ${Colors.grey.darker};
  display: flex;
  justify-content: center;
  align-items: center;
`

export const qualitySelector = () => (
  <SidebarBackground>
    <QualitySelector onChange={voicingChanged} />
  </SidebarBackground>
)

export const rootSelector = () => (
  <SidebarBackground>
    <div>
      <RootSelector root={0} onChange={rootChanged} />
    </div>
  </SidebarBackground>
)

export const voicingSelector = () => (
  <SidebarBackground>
    <div>
      <VoicingEditor onChange={voicingChanged} voicing={[0, 4, 7]} />
    </div>
  </SidebarBackground>
)

export const octaveSelector = () => (
  <SidebarBackground>
    <div>
      <OctaveSelector octave={3} min={3} max={6} onChange={octaveChange} />
    </div>
  </SidebarBackground>
)
