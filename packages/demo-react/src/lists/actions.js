import cuid from 'cuid'

export const CREATE_LIST = 'lists/CREATE_LIST'
export const UPDATE_LIST = 'lists/UPDATE_LIST'
export const DELETE_LIST = 'lists/DELETE_LIST'
export const LIST_UPDATE_RECEIVED = 'lists/LIST_UPDATE_RECEIVED'

export const createList = boardId => ({
  type: CREATE_LIST,
  id: cuid(),
  boardId,
})

export const updateList = ({ id, name }) => ({
  type: UPDATE_LIST,
  id,
  name,
})

export const deleteList = id => ({
  type: DELETE_LIST,
  id,
})

export const listUpdateReceived = list => ({
  type: LIST_UPDATE_RECEIVED,
  list,
})
