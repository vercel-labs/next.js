// Simulates a resource that is expensive to create, e.g. a database connection
// pool, created once at module scope.
const state = ((globalThis as any).__dbConnections ??= { opened: 0 })

class DatabaseConnection {
  public readonly id: number

  constructor() {
    state.opened++
    this.id = state.opened
  }
}

export const db = new DatabaseConnection()

export function totalConnectionsOpened() {
  return state.opened
}

export const marker = 'initial'
