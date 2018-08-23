import { PubSub, withFilter } from 'graphql-subscriptions'
import cuid from 'cuid'

const pubsub = new PubSub()
let now = Date.now()

const Events = {
  BOARD: 'BOARD',
  LIST_UPDATE: 'LIST_UPDATE',
}

const boards = [
  {
    id: 'board_1',
    name: "Ash's Board",
    code: 'ash',
    createdAt: now,
    updatedAt: now,
  },
]

const lists = [
  {
    id: 'list_1',
    boardId: 'board1',
    name: 'My List',
    createdAt: now,
    updatedAt: now,
  },
]

const todos = [
  {
    id: 'todo_1',
    listId: 'list_1',
    label: 'Get Milk',
    done: false,
    pos: 1000,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'todo_2',
    listId: 'list_1',
    label: 'Walk Dog',
    done: true,
    pos: 2000,
    createdAt: now,
    updatedAt: now,
  },
]

export default {
  List: {
    // todos: (list, args, context, info) => {
    //   return todos.filter(todo => todo.listId === list.id)
    // },
  },
  Query: {
    _: () => false,
    getBoard(_, { code }, context, info) {
      let board = boards.find(board => board.code === code)
      if (!board) throw new Error('No board found with that code.')
      return board
    },
  },
  Mutation: {
    createBoard(_, { input }, context, info) {
      const { id, name } = input
      let now = Date.now()
      let board = {
        id,
        name,
        code: cuid.slug(),
        createdAt: now,
        updatedAt: now,
      }
      boards.push(board)
      return board
    },
    updateBoard(_, { input }, context, info) {
      const { id, name } = input
      let now = Date.now()
      let board = boards.find(board => board.id === id)
      if (!board) throw new Error('Board does not exist.')
      if (name) board.name = name
      board.updatedAt = now
      pubsub.publish(Events.BOARD, {
        boardEvent: {
          id,
          serverTime: now,
          board,
        },
      })
      return board
    },
    createList: (_, { input }, context, info) => {
      if (lists.find(list => list.id === input.id)) {
        throw new Error('List already exists')
      }
      const now = Date.now()
      const list = {
        ...input,
        createdAt: now,
        updatedAt: now,
      }
      lists.push(list)
      return list
    },
    updateList: (_, { input }, context, info) => {
      let list = lists.find(list => list.id === input.id)
      if (list.updatedAt > input.updatedAt) {
        throw new Error(
          'Server list is newer than client list. TODO: conflict resolution'
        )
      }
      const now = Date.now()
      let index = lists.indexOf(list)
      lists[index] = {
        ...list,
        ...input,
        updatedAt: now,
      }
      pubsub.publish(Events.LIST_UPDATE, {
        list: lists[index],
        serverTime: now,
      })
      return lists[index]
    },
  },
  Subscription: {
    boardEvent: {
      subscribe: withFilter(
        (_, { id, afterDate }, context, info) => {
          setTimeout(() => {
            const serverTime = Date.now()
            const board = boards.find(
              board =>
                board.id === id && (!afterDate || afterDate < board.updatedAt)
            )
            if (board) {
              pubsub.publish(Events.BOARD, {
                boardEvent: {
                  id,
                  serverTime,
                  board,
                },
              })
            }
          }, 100)
          return pubsub.asyncIterator(Events.BOARD)
        },
        ({ boardEvent }, { id, afterDate }, context, info) => {
          console.log('boardEvent', boardEvent, id, afterDate)
          return (
            boardEvent.id === id &&
            (!afterDate || boardEvent.serverTime > afterDate)
          )
        }
      ),
    },
    listUpdate: {
      subscribe: withFilter(
        (_, { boardId, lastResponse }, context, info) => {
          setTimeout(() => {
            const updatedLists = lists.filter(list => {
              return (
                list.boardId === boardId &&
                (!lastResponse || list.updatedAt > lastResponse)
              )
            })
            updatedLists.forEach(list => {
              pubsub.publish(Events.LIST_UPDATE, {
                listUpdate: list,
              })
            })
          }, 100)
          return pubsub.asyncIterator(Events.LIST_UPDATE)
        },
        ({ listUpdate }, { boardId, lastResponse }, context, info) => {
          return (
            listUpdate.boardId === boardId &&
            listUpdate.updatedAt > lastResponse
          )
        }
      ),
    },
  },
}
