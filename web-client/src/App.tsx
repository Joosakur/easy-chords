import { Switch, Route } from 'wouter'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import RootComponent from './Components/RootComponent'
import GlobalStyles from './Components/common/GlobalStyles'
import Help from './Components/Help'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalStyles>
        <Switch>
          <Route path="/app">
            <RootComponent />
          </Route>
          <Route>
            <Help />
          </Route>
        </Switch>
      </GlobalStyles>
    </DndProvider>
  )
}

export default App
