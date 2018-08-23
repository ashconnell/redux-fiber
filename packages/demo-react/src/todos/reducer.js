import { produce } from 'immer'
// import { createSelector } from 'reselect'

import * as Actions from './actions'
import { CREATE_LIST } from '../lists'

export const TODOS = 'todos'

const initialState = {
  drafts: {
    // [listId]: String
  },
  byId: {
    // [id]: Todo
  },
  byList: {
    // [listId]: [ID]
  },
  removed: [],
}

export const selectTodosState = state => state[TODOS]
export const selectTodoById = (state, todoId) => state[TODOS].byId[todoId]
export const selectTodoIds = (state, listId) =>
  state[TODOS].byList[listId] || []
export const selectDraftTodo = (state, listId) => state[TODOS].drafts[listId]
// export const selectAllTodos = createSelector(selectListsState, selectAllListIds, (state, listIds) =>
//   listIds.map(id => state.byId[id])
// )

export const todosReducer = produce((state, action) => {
  let todo
  switch (action.type) {
    case Actions.SET_DRAFT_TODO:
      state.drafts[action.listId] = action.label
      break

    case Actions.CREATE_TODO_FROM_DRAFT:
      state.byId[action.id] = {
        id: action.id,
        listId: action.listId,
        label: state.drafts[action.listId],
        synced: false,
      }
      state.byList[action.listId].push(action.id)
      state.drafts[action.listId] = ''
      break

    case Actions.SET_TODO_DONE:
      todo = state.byId[action.id]
      todo.done = action.done
      todo.synced = false
      break

    case Actions.SET_TODO_LABEL:
      todo = state.byId[action.id]
      todo.label = action.label
      todo.synced = false
      break

    case Actions.REMOVE_TODO:
      todo = state.byId[action.id]
      state.byList[todo.listId] = state.byList[todo.listId].filter(
        todoId => todoId !== todo.id
      )
      state.removed.push(todo.id)
      break

    case CREATE_LIST:
      state.byList[action.id] = []
      state.drafts[action.id] = ''
      break

    default:
      break
  }
}, initialState)
