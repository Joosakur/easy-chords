import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import RootComponent from './Components/RootComponent'
import GlobalStyles from './Components/common/GlobalStyles'
import Help from './Components/Help'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalStyles>
        <Router>
          <Switch>
            <Route exact path="/app">
              <RootComponent />
            </Route>
            <Route path="/">
              <Help />
            </Route>
          </Switch>
        </Router>
      </GlobalStyles>
    </DndProvider>
  )
}

export default App
