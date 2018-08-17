import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { MdClose } from 'react-icons/md'
import Textarea from 'react-autosize-textarea'

import { selectListById, updateList, removeList } from '../lists'
import {
  selectTodoIds,
  selectDraftTodoLabel,
  setDraftTodoLabel,
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

const ShareText = styled('p')`
  text-align: center;
  font-size: 10px;
  line-height: 1;
  margin: 5px 0;
  color: rgba(255, 255, 255, 0.4);
`

const List = ({
  list,
  setListName,
  removeList,
  todoIds,
  draftLabel,
  setDraftLabel,
  createFromDraft,
}) => (
  <Container>
    <Header>
      <ListNameInput
        value={list.name}
        onChange={e => setListName(e.target.value)}
      />
      <MdClose onClick={removeList} />
    </Header>
    <ShareText>
      Share code: <b>{list.code}</b>
    </ShareText>
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
  draftLabel: selectDraftTodoLabel(state, props.listId),
})

const mapDispatch = (dispatch, props) => ({
  setListName: name => dispatch(updateList({ id: props.listId, name })),
  removeList: () => dispatch(removeList(props.listId)),
  setDraftLabel: label => dispatch(setDraftTodoLabel(props.listId, label)),
  createFromDraft: () => dispatch(createTodoFromDraft(props.listId)),
})

export default connect(
  mapState,
  mapDispatch
)(List)
