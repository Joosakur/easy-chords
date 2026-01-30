import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Route, Switch } from 'wouter'
import GlobalStyles from './Components/common/GlobalStyles'
import Help from './Components/Help'
import RootComponent from './Components/RootComponent'

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
