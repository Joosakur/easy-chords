import React from "react"

import '../src/index.css'
import './preview.css'
import {addDecorator} from "@storybook/react"
import GlobalStyles from "../src/Components/common/GlobalStyles"

addDecorator(fn => <GlobalStyles>{fn()}</GlobalStyles>)
