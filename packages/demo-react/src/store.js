import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import { createFibers } from 'redux-fiber'

import { NETWORK, networkReducer, network } from './network'
import { BOARDS, boardsReducer, boardFibers } from './boards'
import { LISTS, listsReducer, listFibers } from './lists'
import { TODOS, todosReducer } from './todos'

const reducer = combineReducers({
  [NETWORK]: networkReducer,
  [BOARDS]: boardsReducer,
  [LISTS]: listsReducer,
  [TODOS]: todosReducer,
})
const fibers = createFibers(boardFibers /*, listFibers*/)
const middleware = applyMiddleware(fibers, logger, network)
const store = createStore(reducer, middleware)

export default store
