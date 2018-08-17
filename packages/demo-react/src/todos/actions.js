import cuid from 'cuid'

export const SET_DRAFT_TODO_LABEL = 'todos/SET_DRAFT_TODO_LABEL'
export const CREATE_TODO_FROM_DRAFT = 'todos/CREATE_TODO_FROM_DRAFT'
export const SET_TODO_LABEL = 'todos/SET_TODO_LABEL'
export const SET_TODO_DONE = 'todos/SET_TODO_DONE'
export const REMOVE_TODO = 'todos/REMOVE_TODO'

export const setDraftTodoLabel = (listId, label) => ({
  type: SET_DRAFT_TODO_LABEL,
  listId,
  label,
})

export const createTodoFromDraft = listId => ({
  type: CREATE_TODO_FROM_DRAFT,
  id: cuid(),
  listId,
})

export const setTodoLabel = (id, label) => ({
  type: SET_TODO_LABEL,
  id,
  label,
})

export const setTodoDone = (id, done) => ({
  type: SET_TODO_DONE,
  id,
  done,
})

export const removeTodo = id => ({
  type: REMOVE_TODO,
  id,
})
