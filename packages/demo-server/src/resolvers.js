import { PubSub, withFilter } from 'graphql-subscriptions'
import cuid from 'cuid'

import { delay } from './utils'
import db from './db'

const pubsub = new PubSub()

const Events = {
  BOARD: 'BOARD',
  LIST_UPDATE: 'LIST_UPDATE',
}

export default {
  List: {
    // todos: (list, args, context, info) => {
    //   return todos.filter(todo => todo.listId === list.id)
    // },
  },
  Query: {
    _: () => false,
    getBoard(_, { code }, context, info) {
      let board = db.boards.find(board => board.code === code)
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
      db.boards.push(board)
      return board
    },
    async updateBoard(_, { input }, { deviceId }, info) {
      await delay(500)
      const { id, name } = input
      let now = Date.now()
      let board = db.boards.find(board => board.id === id)
      if (!board) throw new Error('Board does not exist.')
      if (name) board.name = name
      board.updatedAt = now
      pubsub.publish(Events.BOARD, {
        boardEvent: {
          id,
          serverTime: now,
          board,
        },
        deviceId,
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
      db.lists.push(list)
      return list
    },
    updateList: (_, { input }, context, info) => {
      let list = db.lists.find(list => list.id === input.id)
      if (list.updatedAt > input.updatedAt) {
        throw new Error(
          'Server list is newer than client list. TODO: conflict resolution'
        )
      }
      const now = Date.now()
      let index = db.lists.indexOf(list)
      lists[index] = {
        ...list,
        ...input,
        updatedAt: now,
      }
      pubsub.publish(Events.LIST_UPDATE, {
        list: db.lists[index],
        serverTime: now,
      })
      return db.lists[index]
    },
  },
  Subscription: {
    boardEvent: {
      subscribe: withFilter(
        (_, { id, afterDate }, { deviceId }, info) => {
          setTimeout(() => {
            const board = db.boards.find(
              board =>
                board.id === id && (!afterDate || board.updatedAt > afterDate)
            )
            if (board) {
              pubsub.publish(Events.BOARD, {
                boardEvent: {
                  id,
                  serverTime: board.updatedAt,
                  board,
                },
                deviceId,
              })
            }
          }, 100)
          return pubsub.asyncIterator(Events.BOARD)
        },
        ({ boardEvent, deviceId }, { id, afterDate }, ctx, info) => {
          return (
            deviceId !== ctx.deviceId &&
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
            const updatedLists = db.lists.filter(list => {
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
