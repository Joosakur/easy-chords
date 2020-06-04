import React from 'react'
import ReactDOM from 'react-dom'
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
  middleware: [sagaMiddleware]
})
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
