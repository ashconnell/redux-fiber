import { SubscriptionClient } from 'subscriptions-transport-ws'
import { networkStatusChanged } from './actions'

const GRAPHQL_ENDPOINT = 'ws://localhost:4000/graphql'

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
})

let deviceId

export const exec = (query, variables) => {
  return client.request({
    query,
    variables,
    context: {
      deviceId,
    },
  })
}

export const network = ({ dispatch, getState }) => {
  client.onConnected(() => dispatch(networkStatusChanged(true)))
  client.onDisconnected(() => dispatch(networkStatusChanged(false)))
  client.onReconnected(() => dispatch(networkStatusChanged(true)))
  // client.onConnecting(() => console.log('[ws] connecting'))
  // client.onReconnecting(() => console.log('[ws] reconnecting'))
  // client.onError(() => console.log('[ws] error'))

  deviceId = getState().network.deviceId

  return next => action => {
    return next(action)
  }
}
