import cuid from 'cuid'
import { produce } from 'immer'

import * as Actions from './actions'

export const NETWORK = 'network'

const initialState = {
  isOnline: true,
  deviceId: cuid(),
}

export const selectNetworkState = state => state[NETWORK]
export const selectIsOnline = state => state[NETWORK].isOnline

export const networkReducer = produce((state, action) => {
  switch (action.type) {
    case Actions.NETWORK_STATUS_CHANGED:
      state.isOnline = action.isOnline
      break

    default:
      break
  }
}, initialState)
