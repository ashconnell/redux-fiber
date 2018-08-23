import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import 'normalize.css'
import 'typeface-roboto'
import { Router } from '@reach/router'

import './global.css'
import store from './store'
import { Home, Board, NetworkInfo } from './components'

const App = () => (
  <Provider store={store}>
    <Fragment>
      <Router>
        <Home path="/" />
        <Board path="/boards/:boardId" />
      </Router>
      <NetworkInfo />
    </Fragment>
  </Provider>
)

export default App
