import type { Preview } from '@storybook/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { DndContext } from '@dnd-kit/core'
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
          <DndContext>
            <Story />
          </DndContext>
        </GlobalStyles>
      </Provider>
    ),
  ],
}

export default preview
