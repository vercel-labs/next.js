'use client'
import { useSyncExternalStore } from 'react'
const subscribe = () => () => {}
const getSnapshot = () => 42
export default function Page() {
  return <p>{String(useSyncExternalStore(subscribe, getSnapshot))}</p>
}
