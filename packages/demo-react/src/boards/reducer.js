import { produce } from 'immer'
import { map } from 'lodash'

import * as Actions from './actions'

export const BOARDS = 'boards'

const initialState = {
  byId: {
    /**
     * [boardId]: {
     *   id: String,
     *   name: String,
     *   code: String,
     *   createdAt: Float,
     *   updatedAt: Float,
     *   hasUpdated: Boolean,
     * }
     */
  },
  lastEvent: {
    // [boardId]: Float
  },
  new: {
    name: '',
    error: null,
  },
  existing: {
    code: '',
    requested: false,
    error: null,
  },
}

export const selectBoardsState = state => state[BOARDS]
export const selectBoardById = (state, boardId) => state[BOARDS].byId[boardId]
export const selectNewBoard = state => state[BOARDS].new
export const selectExistingBoard = state => state[BOARDS].existing
export const selectNewBoards = state => {
  return map(state[BOARDS].byId).filter(board => !board.createdAt)
}
export const selectUpdatedBoards = state => {
  return map(state[BOARDS].byId).filter(
    board => board.hasUpdated && board.createdAt
  )
}
export const selectLastBoardEventDate = (state, boardId) =>
  state[BOARDS].lastEvent[boardId]

export const boardsReducer = produce((state, action) => {
  if (action.type === Actions.SET_NEW_BOARD_NAME) {
    state.new.name = action.name
  }
  if (action.type === Actions.CREATE_BOARD) {
    const { id } = action
    state.byId[id] = {
      id,
      name: state.new.name,
      code: null,
      createdAt: null,
      updatedAt: null,
      hasUpdated: false,
    }
    state.new.name = ''
    state.new.error = null
  }
  if (action.type === Actions.CREATE_BOARD_SUCCESS) {
    const { board } = action
    state.byId[board.id] = {
      ...board,
      hasUpdated: false,
    }
  }
  if (action.type === Actions.SET_EXISTING_BOARD_CODE) {
    const { code } = action
    state.existing.code = code
  }
  if (action.type === Actions.REQUEST_EXISTING_BOARD) {
    state.existing.requested = true
    state.existing.error = null
  }
  if (action.type === Actions.REQUEST_EXISTING_BOARD_SUCCESS) {
    const { board } = action
    state.existing.code = ''
    state.existing.requested = false
    state.byId[board.id] = {
      ...board,
      hasUpdated: false,
    }
  }
  if (action.type === Actions.REQUEST_EXISTING_BOARD_ERROR) {
    const { error } = action
    state.existing.requested = false
    state.existing.error = error
  }
  if (action.type === Actions.UPDATE_BOARD) {
    const { id, data } = action
    state.byId[id] = {
      ...state.byId[id],
      ...data,
      hasUpdated: true,
    }
  }
  if (action.type === Actions.UPDATE_BOARD_SUCCESS) {
    const { board } = action
    state.byId[board.id] = {
      ...board,
      hasUpdated: false,
    }
  }
  if (action.type === Actions.BOARD_EVENT) {
    const { event } = action
    const lastEvent = state.lastEvent[event.id]
    if (!lastEvent || lastEvent < event.serverTime) {
      state.lastEvent[event.id] = event.serverTime
    }
    if (event.board) {
      let board = state.byId[event.id]
      if (board.hasUpdated) return
      state.byId[event.id] = {
        ...board,
        ...event.board,
      }
    }
  }
}, initialState)
