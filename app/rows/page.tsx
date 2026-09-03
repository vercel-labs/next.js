import RefreshConsumer from './refresh-consumer'

export const dynamic = 'force-dynamic'

async function getRows(): Promise<{ rows: any[]; seq: number }> {
  const res = await fetch(
    `http://127.0.0.1:${process.env.PORT || 3000}/api/rows`,
    { cache: 'no-store' }
  )
  return res.json()
}

export default async function RowsPage() {
  const { rows, seq } = await getRows()
  return (
    <main>
      <h1>rows</h1>
      <p id="seq">payload seq: {seq}</p>
      <ul>
        {rows.map((r) => (
          <li key={r.id} id={r.id}>
            {r.label} — {r.status}
          </li>
        ))}
      </ul>
      <RefreshConsumer ids={rows.map((r) => r.id)} />
    </main>
  )
}
