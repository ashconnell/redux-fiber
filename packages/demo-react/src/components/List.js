import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { MdClose } from 'react-icons/md'
import Textarea from 'react-autosize-textarea'

import { selectListById, updateList, deleteList } from '../lists'
import {
  selectTodoIds,
  selectDraftTodo,
  setDraftTodo,
  createTodoFromDraft,
} from '../todos'

import Todo from './Todo'

const Container = styled('div')`
  display: inline-block;
  border-radius: 4px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  width: 220px;
  margin: 0 20px 0 0;
`

const Header = styled('div')`
  display: flex;
  align-items: center;
`

const ListNameInput = styled(Textarea)`
  flex-grow: 1;
`

const AddTodoInput = styled(Textarea)``

const List = ({
  list,
  setListName,
  deleteList,
  todoIds,
  draftLabel,
  setDraftLabel,
  createFromDraft,
}) => (
  <Container>
    <Header>
      <ListNameInput
        placeholder={'List Name'}
        value={list.name}
        onChange={e => setListName(e.target.value)}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            e.preventDefault()
            e.target.blur()
          }
        }}
      />
      <MdClose onClick={deleteList} />
    </Header>
    {todoIds.map(todoId => (
      <Todo key={todoId} todoId={todoId} />
    ))}
    <AddTodoInput
      placeholder="Add Todo"
      value={draftLabel}
      onChange={e => setDraftLabel(e.target.value)}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          e.preventDefault()
          createFromDraft()
        }
      }}
    />
  </Container>
)

const mapState = (state, props) => ({
  list: selectListById(state, props.listId),
  todoIds: selectTodoIds(state, props.listId),
  draftLabel: selectDraftTodo(state, props.listId),
})

const mapDispatch = (dispatch, props) => ({
  setListName: name => dispatch(updateList({ id: props.listId, name })),
  deleteList: () => dispatch(deleteList(props.listId)),
  setDraftLabel: label => dispatch(setDraftTodo(props.listId, label)),
  createFromDraft: () => dispatch(createTodoFromDraft(props.listId)),
})

export default connect(
  mapState,
  mapDispatch
)(List)
