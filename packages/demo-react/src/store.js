import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import { createFibers } from 'redux-fiber'

import { NETWORK, networkReducer, network } from './network'
import {
  BOARDS,
  boardsReducer,
  createBoardFiber,
  getBoardFiber,
  updateBoardFiber,
  boardEventFiber,
} from './boards'
import { LISTS, listsReducer, listUpdatesFiber, createListFiber } from './lists'
import { TODOS, todosReducer } from './todos'

const reducer = combineReducers({
  [NETWORK]: networkReducer,
  [BOARDS]: boardsReducer,
  [LISTS]: listsReducer,
  [TODOS]: todosReducer,
})
const fibers = createFibers(
  createBoardFiber,
  getBoardFiber,
  listUpdatesFiber,
  createListFiber,
  updateBoardFiber,
  boardEventFiber
)
const middleware = applyMiddleware(fibers, logger, network)
const store = createStore(reducer, middleware)

export default store
