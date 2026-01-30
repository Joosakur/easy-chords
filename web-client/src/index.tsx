import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'

import App from './App'
import rootReducer from './state/root-reducer'
import rootSaga from './state/root-saga'
import { Provider } from 'react-redux'

import 'semantic-ui-checkbox/checkbox.css'
import 'semantic-ui-input/input.css'
import './index.css'

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})
sagaMiddleware.run(rootSaga)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
