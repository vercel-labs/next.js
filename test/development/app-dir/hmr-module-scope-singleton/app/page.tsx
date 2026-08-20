import { db, marker, totalConnectionsOpened } from '../lib/db'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <p id="marker">{marker}</p>
      <p id="connection-id">{db.id}</p>
      <p id="connections-opened">{totalConnectionsOpened()}</p>
    </>
  )
}
