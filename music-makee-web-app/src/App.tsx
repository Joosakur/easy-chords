import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import {SettingsContextProvider} from './state/settings-context'
import {ChordMapContextProvider} from './state/chord-map-context'
import {PianoContextProvider} from './state/piano-context'
import RootComponent from './Components/RootComponent'
import GlobalStyles from './Components/common/GlobalStyles'
import SynthInstrument from './utils/music/synth'

import 'semantic-ui-checkbox/checkbox.css'
import 'semantic-ui-input/input.css'

function App() {
  return (
    <>
      <SettingsContextProvider>
        <PianoContextProvider synth={new SynthInstrument()}>
          <ChordMapContextProvider>
            <DndProvider backend={HTML5Backend}>
              <GlobalStyles>
                <RootComponent/>
              </GlobalStyles>
            </DndProvider>
          </ChordMapContextProvider>
        </PianoContextProvider>
      </SettingsContextProvider>
    </>
  )
}

export default App
