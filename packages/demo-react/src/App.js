import React from 'react'
import { Provider } from 'react-redux'
import 'normalize.css'
import 'typeface-roboto'

import './global.css'
import store from './store'
import { Dashboard } from './components'

const App = () => (
  <Provider store={store}>
    <Dashboard />
  </Provider>
)

export default App
