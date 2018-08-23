import { produce } from 'immer'
import { map } from 'lodash'

import * as Actions from './actions'
import { createSelector } from 'reselect'

export const LISTS = 'lists'

const initialState = {
  byId: {
    /**
     * [listId]: {
     *  id: String,
     *  boardId: ID,
     *  name: String,
     *  createdAt: Float,
     *  updatedAt: Float,
     *  __synced: Boolean,
     * }
     */
  },
  byBoard: {
    // [boardId]: [...listId]
  },
  deleted: [
    // listId
  ],
}

export const selectListsState = state => state[LISTS]
export const selectListIdsByBoard = (state, boardId) =>
  state[LISTS].byBoard[boardId] || []
export const selectListById = (state, id) => state[LISTS].byId[id]
export const selectNewLists = state => {
  let x = map(state[LISTS].byId).filter(list => !list.createdAt)
  console.log('x', x)
  return x
}

export const selectListsByBoard = createSelector(
  selectListIdsByBoard,
  selectListsState,
  (listIds, state) => {
    return listIds.map(listId => state.byId[listId])
  }
)

export const selectUpdatedByBoard = createSelector(
  selectListsByBoard,
  lists => {
    lists = lists.filter(list => list.updatedAt)
    const dates = lists.map(list => list.updatedAt)
    return (
      dates.length &&
      dates.reduce((a, b) => {
        return Math.max(a, b)
      })
    )
  }
)

export const listsReducer = produce((state, action) => {
  let list
  switch (action.type) {
    case Actions.CREATE_LIST:
      state.byId[action.id] = {
        id: action.id,
        boardId: action.boardId,
        name: '',
        __synced: false,
      }
      if (!state.byBoard[action.boardId]) {
        state.byBoard[action.boardId] = []
      }
      state.byBoard[action.boardId].push(action.id)
      break

    case Actions.UPDATE_LIST:
      list = state.byId[action.id]
      list.name = action.name
      list.__synced = false
      break
    case Actions.DELETE_LIST:
      list = state.byId[action.id]
      state.byBoard[list.boardId] = state.byBoard[list.boardId].filter(
        listId => listId !== list.id
      )
      state.deleted.push(action.id)
      break

    case Actions.LIST_UPDATE_RECEIVED:
      list = state.byId[action.list.id]
      const newOrUpdated =
        !list || (list.updatedAt && list.updatedAt < action.list.updatedAt)
      if (newOrUpdated) {
        state.byId[action.list.id] = action.list
        if (!state.byBoard[action.list.boardId]) {
          state.byBoard[action.list.boardId] = []
        }
        if (state.byBoard[action.list.boardId].indexOf(action.list.id) === -1) {
          state.byBoard[action.list.boardId].push(action.list.id)
        }
      }
      break

    default:
      break
  }
}, initialState)
