import { db, Db } from '../lib/db'

// CASE A: cached function closes over a MODULE SCOPE non-serializable value.
async function getFromModuleScopeDb() {
  'use cache'
  // `db` is a class instance with methods -> non-serializable
  return db.select().from('notifications')
}

// CASE B: same non-serializable value, but closed over from a LOCAL scope
// (e.g. dependency injection / passed in as a prop).
function makeGetter(injectedDb: Db) {
  async function getFromInjectedDb() {
    'use cache'
    return injectedDb.select().from('notifications')
  }
  return getFromInjectedDb
}

export default async function Page() {
  const a = await getFromModuleScopeDb()

  let b: string
  try {
    b = await makeGetter(new Db())()
  } catch (e) {
    b = 'ERROR: ' + (e as Error).message
  }

  return (
    <main>
      <p id="module-scope">MODULE SCOPE: {a}</p>
      <p id="injected">INJECTED CLOSURE: {b}</p>
    </main>
  )
}
