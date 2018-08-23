import cuid from 'cuid'

export const SET_NEW_BOARD_NAME = 'boards/SET_NEW_BOARD_NAME'
export const CREATE_BOARD = 'boards/CREATE_BOARD'
export const CREATE_BOARD_SUCCESS = 'boards/CREATE_BOARD_SUCCESS'
export const SET_EXISTING_BOARD_CODE = 'boards/SET_EXISTING_BOARD_CODE'
export const REQUEST_EXISTING_BOARD = 'boards/REQUEST_EXISTING_BOARD'
export const REQUEST_EXISTING_BOARD_SUCCESS =
  'boards/REQUEST_EXISTING_BOARD_SUCCESS'
export const REQUEST_EXISTING_BOARD_ERROR =
  'boards/REQUEST_EXISTING_BOARD_ERROR'
export const UPDATE_BOARD = 'boards/UPDATE_BOARD'
export const UPDATE_BOARD_SUCCESS = 'boards/UPDATE_BOARD_SUCCESS'
export const BOARD_EVENT = 'boards/BOARD_EVENT'

export const setNewBoardName = name => ({
  type: SET_NEW_BOARD_NAME,
  name,
})

export const createBoard = () => ({
  type: CREATE_BOARD,
  id: cuid(),
})

export const createBoardSuccess = board => ({
  type: CREATE_BOARD_SUCCESS,
  board,
})

export const setExistingBoardCode = code => ({
  type: SET_EXISTING_BOARD_CODE,
  code,
})

export const requestExistingBoard = () => ({
  type: REQUEST_EXISTING_BOARD,
})

export const requestExistingBoardSuccess = board => ({
  type: REQUEST_EXISTING_BOARD_SUCCESS,
  board,
})

export const requestExistingBoardError = error => ({
  type: REQUEST_EXISTING_BOARD_ERROR,
  error,
})

export const updateBoard = (id, { name }) => ({
  type: UPDATE_BOARD,
  id,
  data: { name },
})

export const updateBoardSuccess = board => ({
  type: UPDATE_BOARD_SUCCESS,
  board,
})

export const boardEvent = event => ({
  type: BOARD_EVENT,
  event,
})
