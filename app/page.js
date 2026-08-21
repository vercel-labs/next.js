import { connection } from 'next/server'

export default async function Page() {
  await connection() // force dynamic rendering so logs happen in `next start`
  // BUG: `error.stack` is NOT sourcemapped in `next start`, even with
  // NODE_OPTIONS=--enable-source-maps and server sourcemaps emitted.
  console.log('stack string  :', new Error().stack)
  // Logging the error object IS sourcemapped (patch-error-inspect util.inspect path).
  console.log('error object  :', new Error())
  return <p>see server logs</p>
}
