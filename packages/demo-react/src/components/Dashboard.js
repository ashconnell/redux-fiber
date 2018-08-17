import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'

import { selectAllListIds } from '../lists'

import List from './List'
import AddList from './AddList'

const ListsContainer = styled('div')`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
`

const Dashboard = ({ listIds }) => (
  <Fragment>
    <h1>Lists</h1>
    <ListsContainer>
      {listIds.map(listId => (
        <List key={listId} listId={listId} />
      ))}
      <AddList />
    </ListsContainer>
  </Fragment>
)

const mapState = state => ({
  listIds: selectAllListIds(state),
})

const mapDispatch = dispatch => ({
  // ..
})

export default connect(
  mapState,
  mapDispatch
)(Dashboard)
