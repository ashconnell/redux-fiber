import React from 'react'
import { connect } from 'react-redux'

import {
  selectNewList,
  selectExistingList,
  setNewListName,
  createNewList,
  setExistingListCode,
  requestExistingList,
} from '../lists'

const AddList = ({
  newList,
  setNewListName,
  createNewList,
  existingList,
  setExistingListCode,
  requestExistingList,
}) => (
  <div>
    <form
      onSubmit={e => {
        e.preventDefault()
        createNewList()
      }}
    >
      <p>New List</p>
      <input
        type="text"
        placeholder="Name"
        value={newList.name}
        onChange={e => setNewListName(e.target.value)}
      />
    </form>
    <form
      onSubmit={e => {
        e.preventDefault()
        requestExistingList()
      }}
    >
      <p>Existing List</p>
      <input
        type="text"
        placeholder="Code"
        value={existingList.code || ''}
        onChange={e => setExistingListCode(e.target.value)}
      />
      {existingList.error && <p>Error: {existingList.error}</p>}
    </form>
  </div>
)

const mapState = (state, props) => ({
  newList: selectNewList(state),
  existingList: selectExistingList(state),
})

const mapDispatch = (dispatch, props) => ({
  setNewListName: name => dispatch(setNewListName(name)),
  createNewList: () => dispatch(createNewList()),
  setExistingListCode: code => dispatch(setExistingListCode(code)),
  requestExistingList: () => dispatch(requestExistingList()),
})

export default connect(
  mapState,
  mapDispatch
)(AddList)
