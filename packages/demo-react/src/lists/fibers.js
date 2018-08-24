import { selectNewLists } from './reducer'
import { listUpdateReceived } from './actions'
import { exec } from '../network'
import gql from 'graphql-tag'
import { selectUpdatedByBoard } from './reducer'

const listUpdateSubscription = gql`
  subscription($boardId: ID!, $lastResponse: Float) {
    listUpdate(boardId: $boardId, lastResponse: $lastResponse) {
      id
      boardId
      name
      createdAt
      updatedAt
    }
  }
`

const createListMutation = gql`
  mutation($list: CreateListInput!) {
    createList(input: $list) {
      id
      boardId
      name
      createdAt
      updatedAt
    }
  }
`

const createListFiber = {
  name: 'createList',
  selectors: [selectNewLists],
  getProps: newLists => newLists,
  getKey: ({ id }) => id,
  start: (list, dispatch, getState) => {
    // setTimeout(() => {
    //   dispatch(updateList({ ...list, new: false }))
    // }, 2000)
  },
}

const listUpdatesFiber = {
  name: 'listUpdates',
  getProps: state => {
    // TODO: use a declarative <Fiber/> component since this is
    // actually based on the UI presence of the board
    const path = window.location.pathname
    if (path.startsWith('/boards/')) {
      const boardId = path.replace('/boards/', '')
      const lastResponse = selectUpdatedByBoard(state, boardId)
      return {
        boardId,
        lastResponse,
      }
    }
  },
  getKey: ({ boardId }) => boardId,
  start: ({ boardId, lastResponse }, dispatch, getState) => {
    const req = exec(listUpdateSubscription, {
      boardId,
      lastResponse,
    }).subscribe({
      next: ({ data }) => {
        dispatch(listUpdateReceived(data.listUpdate))
      },
    })
    return req.unsubscribe
  },
}

export const listFibers = [listUpdatesFiber, createListFiber]
