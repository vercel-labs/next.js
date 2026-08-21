const store: Map<string, { id: string; name: string }> =
  (globalThis as any).__items ?? ((globalThis as any).__items = new Map())

export function listItems() {
  return [...store.values()]
}

export function addItem(name: string) {
  const id = String(store.size + 1)
  store.set(id, { id, name })
}

export function getItem(id: string) {
  return store.get(id)
}

export function removeItem(id: string) {
  store.delete(id)
}
