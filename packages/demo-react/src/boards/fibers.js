import gql from 'graphql-tag'
import { navigate } from '@reach/router'

import { exec } from '../network'

import {
  selectExistingBoard,
  selectNewBoards,
  selectUpdatedBoards,
  selectLastBoardEventDate,
} from './reducer'
import {
  requestExistingBoardSuccess,
  requestExistingBoardError,
  updateBoardSuccess,
  createBoardSuccess,
  boardEvent,
} from './actions'

const createBoard = gql`
  mutation($input: BoardInput!) {
    createBoard(input: $input) {
      id
      name
      code
      createdAt
      updatedAt
    }
  }
`

const getBoard = gql`
  query($code: ID!) {
    getBoard(code: $code) {
      id
      name
      code
      createdAt
      updatedAt
    }
  }
`

const updateBoard = gql`
  mutation($input: BoardInput!) {
    updateBoard(input: $input) {
      id
      name
      code
      createdAt
      updatedAt
    }
  }
`

const subscribeToBoard = gql`
  subscription($id: ID!, $afterDate: Float) {
    boardEvent(id: $id, afterDate: $afterDate) {
      id
      serverTime
      board {
        id
        name
        code
        createdAt
        updatedAt
      }
    }
  }
`

const createBoardFiber = {
  name: 'createBoard',
  selectors: [selectNewBoards],
  getProps: boards => boards,
  start: store => ({ id, name }) => {
    // TODO: simplify exec() to return a cancel and hide the fluff :)
    const req = exec(createBoard, { input: { id, name } }).subscribe({
      next: ({ data }) => {
        if (data && data.createBoard) {
          store.dispatch(createBoardSuccess(data.createBoard))
        } else {
          console.log('createBoard error') // TODO: this should never happen?
        }
      },
    })
    return req.unsubscribe
  },
}

const getBoardFiber = {
  name: 'getBoard',
  selectors: [selectExistingBoard],
  getProps: ({ code, requested }) => {
    if (!requested) return
    return { code }
  },
  start: store => props => {
    const req = exec(getBoard, props).subscribe({
      next: ({ data }) => {
        if (data && data.getBoard) {
          store.dispatch(requestExistingBoardSuccess(data.getBoard))
          navigate(`/boards/${data.getBoard.id}`)
        } else {
          store.dispatch(
            requestExistingBoardError('TODO: Something went wrong :(')
          )
        }
      },
    })
    return req.unsubscribe
  },
}

const updateBoardFiber = {
  name: 'updateBoard',
  selectors: [selectUpdatedBoards],
  getProps: boards => boards.map(({ id, name }) => ({ id, name })),
  start: store => props => {
    let req = exec(updateBoard, { input: props }).subscribe({
      next: ({ data }) => {
        if (data && data.updateBoard) {
          store.dispatch(updateBoardSuccess(data.updateBoard))
        } else {
          // TODO: conflict resolution
          console.log('updateBoard: TODO: conflict res')
        }
      },
    })
    return req.unsubscribe
  },
  throttle: 1000,
}

const boardEventFiber = {
  name: 'boardEvent',
  getProps: state => {
    // TODO: use a declarative <Fiber/> component since this is
    // actually based on the UI presence of the board
    const path = window.location.pathname
    if (path.startsWith('/boards/')) {
      const id = path.replace('/boards/', '')
      const afterDate = selectLastBoardEventDate(state, id)
      return {
        id,
        afterDate,
      }
    }
  },
  start: store => props => {
    const req = exec(subscribeToBoard, props).subscribe({
      next: ({ data }) => {
        const event = data && data.boardEvent
        if (!event) {
          console.log('boardEvent error?')
          return
        }
        // switch (event.type) {
        //   // ...
        // }
        store.dispatch(boardEvent(event))
      },
    })
    return req.unsubscribe
  },
}

export const boardFibers = [
  createBoardFiber,
  getBoardFiber,
  updateBoardFiber,
  boardEventFiber,
]
