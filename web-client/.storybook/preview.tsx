import type { Preview } from '@storybook/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import GlobalStyles from '../src/Components/common/GlobalStyles'
import rootReducer, { initialRootState } from '../src/state/root-reducer'

import '../src/index.css'
import './preview.css'

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialRootState,
})

const preview: Preview = {
  decorators: [
    (Story) => (
      <Provider store={store}>
        <GlobalStyles>
          <DndProvider backend={HTML5Backend}>
            <Story />
          </DndProvider>
        </GlobalStyles>
      </Provider>
    ),
  ],
}

export default preview
