// Server-side mutable store + tiny SSE broadcaster (single Node process).
type Row = { id: string; label: string; status: string }

const g = globalThis as any

if (!g.__repro) {
  g.__repro = {
    rows: [
      { id: 'row-1', label: 'Alpha', status: 'pending' },
      { id: 'row-2', label: 'Beta', status: 'pending' },
      { id: 'row-3', label: 'Gamma', status: 'pending' },
    ] as Row[],
    subscribers: new Set<(data: string) => void>(),
    seq: 0,
  }
}

export const store = g.__repro as {
  rows: Row[]
  subscribers: Set<(data: string) => void>
  seq: number
}

export function resetRows() {
  store.rows = store.rows.map((r) => ({ ...r, status: 'pending' }))
  store.seq = 0
}

export function mutateAndBroadcast(id: string) {
  store.seq += 1
  store.rows = store.rows.map((r) =>
    r.id === id ? { ...r, status: `done-${store.seq}` } : r
  )
  const payload = JSON.stringify({ id, seq: store.seq, at: Date.now() })
  for (const send of store.subscribers) send(payload)
}
