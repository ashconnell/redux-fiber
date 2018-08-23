import React, { Fragment } from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'

import { selectIsOnline } from '../network'
import {
  selectNewBoard,
  selectExistingBoard,
  setNewBoardName,
  createBoard,
  setExistingBoardCode,
  requestExistingBoard,
} from '../boards'

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Title = styled('h1')`
  font-size: 32px;
  font-weight: 500;
  line-height: 1.2;
  margin: 0 0 10px;
`

const Text = styled('p')`
  font-size: 15px;
  line-height: 1.2;
  margin: 0 0 30px;
`

const Input = styled('input')``

const Button = styled('button')`
  border-radius: 4px;
  background: blue;
`

const Home = ({
  newBoard,
  existingBoard,
  setNewBoardName,
  setExistingBoardCode,
  isOnline,
  createBoard,
  requestExistingBoard,
}) => (
  <Container>
    <Title>Create</Title>
    <Text>Create a new board</Text>
    <Input
      placeholder={'Name'}
      disabled={newBoard.requested}
      value={newBoard.name}
      onChange={e => setNewBoardName(e.target.value)}
    />
    {!newBoard.requested && <Button onClick={createBoard}>Create</Button>}
    {newBoard.error && <p>{newBoard.error}</p>}

    <Title>Join</Title>
    <Text>Join an existing board</Text>
    <Input
      placeholder={'Code'}
      disabled={existingBoard.requested}
      value={existingBoard.code}
      onChange={e => setExistingBoardCode(e.target.value)}
    />
    {isOnline && (
      <Fragment>
        {!existingBoard.requested && (
          <Button onClick={requestExistingBoard}>Join</Button>
        )}
        {existingBoard.requested && <p>Loading</p>}
        {existingBoard.error && <p>{existingBoard.error}</p>}
      </Fragment>
    )}
    {!isOnline && <p>You are offline</p>}
  </Container>
)

const mapState = state => ({
  existingBoard: selectExistingBoard(state),
  newBoard: selectNewBoard(state),
  isOnline: selectIsOnline(state),
})

const mapDispatch = dispatch => ({
  setNewBoardName: name => dispatch(setNewBoardName(name)),
  setExistingBoardCode: code => dispatch(setExistingBoardCode(code)),
  createBoard: () => {
    const action = createBoard()
    dispatch(action)
    navigate(`/boards/${action.id}`)
  },
  requestExistingBoard: () => dispatch(requestExistingBoard()),
})

export default connect(
  mapState,
  mapDispatch
)(Home)
