'use server'

// Minimal stand-in for a builder-pattern action client (e.g. next-safe-action)
const actionClient = {
  schema(_s: unknown) {
    return { action: (fn: () => Promise<void>) => fn }
  },
}

const things = { alpha: 1, beta: 2 }

export const $serverAction = actionClient
  .schema({
    things: Object.entries(things).map(([kind]) => kind),
  })
  .action(async () => {})
