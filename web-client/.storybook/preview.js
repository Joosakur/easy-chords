import React from "react"
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {addDecorator} from "@storybook/react"
import GlobalStyles from "../src/Components/common/GlobalStyles"
import {initialRootState} from "../src/state/root-reducer"

import '../src/index.css'
import './preview.css'

const mockStore = configureStore([])
const initialState = initialRootState

addDecorator(fn =>
    <Provider store={mockStore(initialState)}>
        <GlobalStyles>
            <DndProvider backend={HTML5Backend}>
                {fn()}
            </DndProvider>
        </GlobalStyles>
    </Provider>
)
