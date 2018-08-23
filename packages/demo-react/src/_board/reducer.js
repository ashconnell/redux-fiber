import { produce } from 'immer'
import cuid from 'cuid'

import * as Actions from './actions'

export const BOARD = 'board'

const initialState = {
  id: null,
}

export const selectBoardState = state => state[BOARD]
export const selectBoardId = state => state[BOARD].id

export const boardReducer = produce((state, action) => {
  switch (action.type) {
    case Actions.SET_BOARD_ID:
      state.id = action.id
      break

    default:
      break
  }
}, initialState)
