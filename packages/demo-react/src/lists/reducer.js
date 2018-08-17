import { produce } from 'immer'
// import { createSelector } from 'reselect'

import * as Actions from './actions'

export const LISTS = 'lists'

const initialState = {
  newList: {
    name: '',
  },
  existingList: {
    code: null,
    error: null,
    requested: false,
  },
  all: [],
  removed: [],
  byId: {},
}

export const selectListsState = state => state[LISTS]
export const selectAllListIds = state => state[LISTS].all
export const selectNewList = state => state[LISTS].newList
export const selectExistingList = state => state[LISTS].existingList
export const selectListById = (state, id) => state[LISTS].byId[id]
// export const selectAllLists = createSelector(selectListsState, selectAllListIds, (state, listIds) =>
//   listIds.map(id => state.byId[id])
// )

export const listsReducer = produce((state, action) => {
  let list
  switch (action.type) {
    case Actions.SET_NEW_LIST_NAME:
      state.newList.name = action.name
      break

    case Actions.CREATE_NEW_LIST:
      state.byId[action.id] = {
        id: action.id,
        name: state.newList.name,
        code: action.slug,
        synced: false,
      }
      state.all.push(action.id)
      state.newList.name = ''
      break

    case Actions.SET_EXISTING_LIST_CODE:
      state.existingList.code = action.code
      break

    case Actions.REQUEST_EXISTING_LIST:
      state.existingList.requested = true
      break

    case Actions.UPDATE_LIST:
      list = state.byId[action.id]
      list.name = action.name
      list.synced = false
      break
    case Actions.REMOVE_LIST:
      state.all = state.all.filter(id => id !== action.id)
      state.removed.push(action.id)
      break

    default:
      break
  }
}, initialState)
