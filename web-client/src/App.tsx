import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import RootComponent from './Components/RootComponent'
import GlobalStyles from './Components/common/GlobalStyles'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalStyles>
        <RootComponent />
      </GlobalStyles>
    </DndProvider>
  )
}

export default App
