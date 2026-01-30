import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Route, Switch } from 'wouter'
import GlobalStyles from './Components/common/GlobalStyles'
import Help from './Components/Help'
import RootComponent from './Components/RootComponent'

function App() {
  const sensors = useSensors(useSensor(PointerSensor))

  return (
    <DndContext sensors={sensors}>
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
    </DndContext>
  )
}

export default App
