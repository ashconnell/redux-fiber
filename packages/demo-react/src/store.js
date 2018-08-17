import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import { createFibers } from 'redux-fiber'

import { LISTS, listsReducer, createListFiber } from './lists'
import { TODOS, todosReducer } from './todos'

const reducer = combineReducers({
  [LISTS]: listsReducer,
  [TODOS]: todosReducer,
})
const fibers = createFibers(createListFiber)
const middleware = applyMiddleware(logger, fibers)
const store = createStore(reducer, middleware)

export default store
