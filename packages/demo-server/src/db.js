const now = Date.now()

const db = {
  boards: [
    {
      id: 'board_1',
      name: "Ash's Board",
      code: 'ash',
      createdAt: now,
      updatedAt: now,
    },
  ],
  lists: [
    {
      id: 'list_1',
      boardId: 'board1',
      name: 'My List',
      createdAt: now,
      updatedAt: now,
    },
  ],
  todos: [
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
  ],
}

export default db
