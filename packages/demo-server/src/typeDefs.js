import { gql } from 'apollo-server'

export default gql`
  type Board {
    id: ID!
    name: String
    code: ID!
    createdAt: Float!
    updatedAt: Float!
  }

  input BoardInput {
    id: ID!
    name: String
  }

  type BoardEvent {
    id: ID!
    serverTime: Float!
    board: Board
  }

  type List {
    id: ID!
    boardId: ID!
    name: String
    createdAt: Float!
    updatedAt: Float
  }

  input CreateListInput {
    id: ID!
    boardId: ID!
    name: String
  }

  input UpdateListInput {
    id: ID!
    name: String
    updatedAt: Float!
  }

  type Todo {
    id: ID!
    listId: ID!
    label: String
    done: Boolean
    pos: Float
    createdAt: Float
    updatedAt: Float
  }

  input CreateTodoInput {
    id: ID!
    listId: ID!
    label: String
    done: Boolean
    pos: Float
  }

  input UpdateTodoInput {
    id: ID!
    label: String
    done: Boolean
    pos: Float
    updatedAt: Float!
  }

  type Query {
    _: Boolean!
    getBoard(code: ID!): Board!
  }

  type Mutation {
    createBoard(input: BoardInput!): Board!
    updateBoard(input: BoardInput!): Board!

    createList(input: CreateListInput!): List!
    updateList(input: UpdateListInput!): List!
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo!
  }

  type Subscription {
    boardEvent(id: ID!, afterDate: Float): BoardEvent!
    listUpdate(boardId: ID!, lastResponse: Float): List!
  }
`
