// Fake "database" that is only reachable when DATABASE_AVAILABLE=1.
// Build environments in the issue have no DB access; runtime does.
export async function queryPosts() {
  if (process.env.DATABASE_AVAILABLE !== '1') {
    throw new Error('DB_UNREACHABLE: no database access in this environment')
  }
  return [{ id: 1, title: 'hello from the database at ' + new Date().toISOString() }]
}
