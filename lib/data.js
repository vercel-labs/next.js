import 'server-only'

let lookups = 0

export async function findUserById(id) {
  lookups++
  console.log(
    `[db] findUserById(${id}) lookup #${lookups} at ${new Date().toISOString()}`
  )
  await new Promise((r) => setTimeout(r, 50))
  return { id, name: 'Ada' }
}

export async function getNotes() {
  return [
    { id: '1', text: 'first note' },
    { id: '2', text: 'second note' },
    { id: '3', text: 'third note' },
    { id: '4', text: 'fourth note' },
  ]
}
