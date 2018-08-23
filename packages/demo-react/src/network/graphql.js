import { ApolloLink, execute } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { networkStatusChanged } from './actions'

const GRAPHQL_ENDPOINT = 'ws://localhost:4000/graphql'

const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
})

const webSocketLink = new WebSocketLink(client)
const errorLink = onError(operation => {
  console.log('[errorLink]', operation)
  const { graphQLErrors, networkError } = operation
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const link = ApolloLink.from([errorLink, webSocketLink])

export const exec = (query, variables) => {
  return execute(link, {
    query,
    variables,
    // operationName: {},
    // context: {},
    // extensions: {},
  })
}

export const network = ({ dispatch }) => {
  client.onConnected(() => dispatch(networkStatusChanged(true)))
  client.onDisconnected(() => dispatch(networkStatusChanged(false)))
  client.onReconnected(() => dispatch(networkStatusChanged(true)))
  // client.onConnecting(() => console.log('[ws] connecting'))
  // client.onReconnecting(() => console.log('[ws] reconnecting'))
  // client.onError(() => console.log('[ws] error'))

  return next => action => {
    return next(action)
  }
}
