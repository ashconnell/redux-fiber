import 'babel-polyfill'
import { ApolloServer } from 'apollo-server'

import { strip } from './utils'
import typeDefs from './typeDefs'
import resolvers from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: true,
  // playground: {
  //   tabs: [
  //     {
  //       name: 'Create List',
  //       endpoint: 'http://localhost:4000',
  //       query: strip(
  //         `
  //         mutation($input: CreateListInput!) {
  //           createList(input: $input) {
  //             id
  //             name
  //             code
  //             createdAt
  //             updatedAt
  //           }
  //         }
  //       `,
  //         10
  //       ),
  //       variables: strip(
  //         `
  //         {
  //           "input": {
  //             "id": "list-x",
  //             "name": "My New List"
  //           }
  //         }
  //       `,
  //         10
  //       ),
  //     },
  //     {
  //       name: 'Update List',
  //       endpoint: 'http://localhost:4000',
  //       query: strip(
  //         `
  //         mutation($input: UpdateListInput!) {
  //           updateList(input: $input) {
  //             id
  //             name
  //             code
  //             createdAt
  //             updatedAt
  //           }
  //         }`,
  //         10
  //       ),
  //       variables: strip(
  //         `
  //         {
  //           "input": {
  //             "id": "list-x",
  //             "name": "My New List",
  //             "updatedAt": -1
  //           }
  //         }
  //       `,
  //         10
  //       ),
  //     },
  //     {
  //       name: 'Subscribe List',
  //       endpoint: 'http://localhost:4000',
  //       query: strip(
  //         `
  //         subscription($code: String!, $lastUpdatedAt: Float!) {
  //           listUpdated(code: $code, lastUpdatedAt: $lastUpdatedAt) {
  //             id
  //             name
  //             code
  //             createdAt
  //             updatedAt
  //           }
  //         }`,
  //         10
  //       ),
  //       variables: strip(
  //         `
  //         {
  //           "code": "-",
  //           "lastUpdatedAt": -1
  //         }
  //       `,
  //         10
  //       ),
  //     },
  //     {
  //       name: 'Create Todo',
  //       endpoint: 'http://localhost:4000',
  //       query: strip(
  //         `
  //         mutation($input: CreateTodoInput!) {
  //           createTodo(input: $input) {
  //             id
  //             name
  //             code
  //             createdAt
  //             updatedAt
  //           }
  //         }
  //       `,
  //         10
  //       ),
  //       variables: strip(
  //         `
  //         {
  //           "input": {
  //             "id": "list-x",
  //             "name": "My New List"
  //           }
  //         }
  //       `,
  //         10
  //       ),
  //     },
  //   ],
  // },
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url}`)
  console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`)
})
