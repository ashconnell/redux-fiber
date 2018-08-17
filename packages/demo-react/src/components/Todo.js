import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { MdClose, MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import Textarea from 'react-autosize-textarea'

import { selectTodoById, setTodoLabel, setTodoDone, removeTodo } from '../todos'

const Container = styled('div')`
  display: flex;
  align-items: center;
`

const Input = styled(Textarea)`
  flex-grow: 1;
  margin: 10px 5px;
  width: 100%;
  font-style: ${props => (props.done ? 'italic' : 'normal')};
  color: ${props => (props.done ? 'rgba(255, 255, 255, .4)' : 'inherit')};
  text-decoration: ${props => (props.done ? 'line-through' : 'inherit')};
`

const CloseIcon = styled(MdClose)`
  flex-shrink: 0;
`

const CheckBoxOff = styled(MdCheckBoxOutlineBlank)`
  flex-shrink: 0;
`

const CheckBoxOn = styled(MdCheckBox)`
  flex-shrink: 0;
`

const Todo = ({ todo, setLabel, setDone, remove }) => (
  <Container>
    {todo.done && <CheckBoxOn onClick={() => setDone(false)} />}
    {!todo.done && <CheckBoxOff onClick={() => setDone(true)} />}
    <Input
      done={todo.done}
      value={todo.label}
      onChange={e => setLabel(e.target.value)}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          e.preventDefault()
          e.target.blur()
        }
      }}
    />
    <CloseIcon onClick={remove} />
  </Container>
)

const mapStateToProps = (state, props) => ({
  todo: selectTodoById(state, props.todoId),
})

const mapDispatchToProps = (dispatch, props) => ({
  setLabel: label => dispatch(setTodoLabel(props.todoId, label)),
  setDone: done => dispatch(setTodoDone(props.todoId, done)),
  remove: () => dispatch(removeTodo(props.todoId)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo)
