import { useSyncExternalStore } from 'react'

let value = 0
const listeners = new Set()
function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot() {
  return value
}

export default function Home() {
  // NOTE: only 2 arguments, no getServerSnapshot
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)
  return <p id="out">store value: {String(snapshot)}</p>
}
