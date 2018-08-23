import gql from 'graphql-tag'
import { navigate } from '@reach/router'
import { memoize, throttle } from 'lodash'

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

export const createBoardFiber = {
  name: 'createBoard',
  selectors: [selectNewBoards],
  getProps: boards => boards,
  start: ({ id, name }, dispatch, getState) => {
    const req = exec(createBoard, { input: { id, name } }).subscribe({
      next: ({ data }) => {
        if (data && data.createBoard) {
          dispatch(createBoardSuccess(data.createBoard))
        } else {
          // TODO: this should never happen?
          console.log('createBoard error')
        }
      },
    })
    return req.unsubscribe
  },
}

export const getBoardFiber = {
  name: 'getBoard',
  selectors: [selectExistingBoard],
  getProps: ({ code, requested }) => {
    if (!requested) return
    return { code }
  },
  start: ({ code }, dispatch, getState) => {
    const req = exec(getBoard, { code }).subscribe({
      next: ({ data }) => {
        if (data && data.getBoard) {
          dispatch(requestExistingBoardSuccess(data.getBoard))
          navigate(`/boards/${data.getBoard.id}`)
        } else {
          dispatch(requestExistingBoardError('TODO: Something went wrong :('))
        }
      },
    })
    return req.unsubscribe
  },
}

const keyedThrottle = memoize((id, fn, delay) => throttle(fn, delay))

export const updateBoardFiber = {
  name: 'updateBoard',
  selectors: [selectUpdatedBoards],
  getProps: boards => boards,
  start: (data, dispatch, getState) => {
    let didStop
    let req
    const send = keyedThrottle(
      data.id,
      data => {
        if (req) req.unsubscribe()
        if (didStop) return
        req = exec(updateBoard, { input: data }).subscribe({
          next: ({ data }) => {
            if (data && data.updateBoard) {
              dispatch(updateBoardSuccess(data.updateBoard))
            } else {
              // TODO: conflict resolution
              console.log('updateBoard: TODO: conflict res')
            }
          },
        })
      },
      1000
    )
    send(data)

    return {
      update: data => send(data),
      cancel: () => {
        didStop = true
        req.unsubscribe()
      },
    }
  },
}

export const boardEventFiber = {
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
  start: ({ id, afterDate }, dispatch, getState) => {
    const req = exec(subscribeToBoard, { id, afterDate }).subscribe({
      next: ({ data }) => {
        const event = data && data.boardEvent
        if (!event) {
          console.log('boardEvent error?')
          return
        }
        // switch (event.type) {
        //   // ...
        // }
        dispatch(boardEvent(event))
      },
    })
    return req.unsubscribe
  },
}
