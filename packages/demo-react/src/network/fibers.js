// import { selectNewLists } from './reducer'
// import { listUpdateReceived } from './actions'
// import { exec } from '../graphql'
// import gql from 'graphql-tag'
// import { selectUpdatedByBoard } from './reducer'

// const listUpdateSubscription = gql`
//   subscription($boardId: ID!, $lastResponse: Float) {
//     listUpdate(boardId: $boardId, lastResponse: $lastResponse) {
//       id
//       boardId
//       name
//       createdAt
//       updatedAt
//     }
//   }
// `

// const createListMutation = gql`
//   mutation($list: CreateListInput!) {
//     createList(input: $list) {
//       id
//       boardId
//       name
//       createdAt
//       updatedAt
//     }
//   }
// `

// export const listUpdatesFiber = {
//   name: 'listUpdates',
//   getProps: state => {
//     // TODO: use a <Fiber/> component since this is
//     // actually based on UI presence of the board
//     const path = window.location.pathname
//     if (path.startsWith('/boards/')) {
//       const boardId = path.replace('/boards/', '')
//       const lastResponse = selectUpdatedByBoard(state, boardId)
//       return {
//         boardId,
//         lastResponse,
//       }
//     }
//   },
//   getKey: ({ boardId }) => boardId,
//   start: ({ boardId, lastResponse }, dispatch, getState) => {
//     return exec(listUpdateSubscription, {
//       boardId,
//       lastResponse,
//     }).subscribe({
//       next: ({ data }) => dispatch(listUpdateReceived(data.listUpdate)),
//       // error: error => console.log('error', error),
//       // complete: () => console.log('complete'),
//     }).unsubscribe
//   },
// }

// export const createListFiber = {
//   name: 'createList',
//   selectors: [selectNewLists],
//   getKey: ({ id }) => id,
//   start: (list, dispatch, getState) => {
//     // setTimeout(() => {
//     //   dispatch(updateList({ ...list, new: false }))
//     // }, 2000)
//   },
// }
