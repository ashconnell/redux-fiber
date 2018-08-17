import cuid from 'cuid'

export const SET_NEW_LIST_NAME = 'lists/SET_NEW_LIST_NAME'
export const CREATE_NEW_LIST = 'lists/CREATE_NEW_LIST'
export const SET_EXISTING_LIST_CODE = 'lists/SET_EXISTING_LIST_CODE'
export const REQUEST_EXISTING_LIST = 'lists/REQUEST_EXISTING_LIST'
export const UPDATE_LIST = 'lists/UPDATE_LIST'
export const REMOVE_LIST = 'lists/REMOVE_LIST'

export const setNewListName = name => ({
  type: SET_NEW_LIST_NAME,
  name,
})

export const createNewList = () => ({
  type: CREATE_NEW_LIST,
  id: cuid(),
  slug: cuid.slug(),
})

export const setExistingListCode = code => ({
  type: SET_EXISTING_LIST_CODE,
  code,
})

export const requestExistingList = () => ({
  type: REQUEST_EXISTING_LIST,
})

export const updateList = ({ id, name }) => ({
  type: UPDATE_LIST,
  id,
  name,
})

export const removeList = id => ({
  type: REMOVE_LIST,
  id,
})
