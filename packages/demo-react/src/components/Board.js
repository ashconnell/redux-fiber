import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'

import { selectListIdsByBoard, createList } from '../lists'

import List from './List'
import { selectBoardById, updateBoard } from '../boards'

const Header = styled('div')`
  display: flex;
  align-items: center;
  height: 60px;
`

const Lists = styled('div')`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
`

const Board = ({ board, updateBoard, listIds, createList }) => (
  <Fragment>
    <Header>
      <input
        type="text"
        value={board.name}
        onChange={e => updateBoard({ name: e.target.value })}
      />
      <h1>Board: {board.name}</h1>
      <p>{board.code || 'no-code'}</p>
    </Header>
    <Lists>
      {listIds.map(listId => (
        <List key={listId} listId={listId} />
      ))}
      <button onClick={createList}>Create List</button>
    </Lists>
  </Fragment>
)

const mapState = (state, props) => ({
  board: selectBoardById(state, props.boardId),
  listIds: selectListIdsByBoard(state, props.boardId),
})

const mapDispatch = (dispatch, props) => ({
  updateBoard: data => dispatch(updateBoard(props.boardId, data)),
  createList: () => dispatch(createList(props.boardId)),
})

export default connect(
  mapState,
  mapDispatch
)(Board)
