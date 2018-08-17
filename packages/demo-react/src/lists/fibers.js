// import { selectNewLists } from './reducer'
import { updateList } from './actions'

export const createListFiber = {
  name: 'createList',
  // getProps: selectNewLists,
  getProps: () => null,
  getKey: ({ id }) => id,
  start: (list, dispatch, getState) => {
    setTimeout(() => {
      dispatch(updateList({ ...list, new: false }))
    }, 2000)
  },
}
