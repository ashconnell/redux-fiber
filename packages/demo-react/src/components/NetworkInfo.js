import React from 'react'
import { connect } from 'react-redux'
import styled from 'react-emotion'
import { MdFlashOn } from 'react-icons/md'

import { selectIsOnline } from '../network'

const Bar = styled('div')`
  position: absolute;
  bottom: ${props => (props.visible ? 0 : '-100px')};
  left: 0;
  right: 0;
  background: #bd1d1d;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled('span')`
  display: block;
  text-align: center;
  font-size: 13px;
`

const ConnectionIcon = styled(MdFlashOn)`
  margin-right: 5px;
`

const NetworkInfo = ({ isOnline }) => (
  <Bar visible={!isOnline}>
    <ConnectionIcon />
    <Text>{'You are offline.'}</Text>
  </Bar>
)

const mapState = (state, props) => ({
  isOnline: selectIsOnline(state),
})

const mapDispatch = (dispatch, props) => ({
  // ...
})

export default connect(
  mapState,
  mapDispatch
)(NetworkInfo)
