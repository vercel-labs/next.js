'use client'
import { store } from './store'

export default function Counter() {
  return <p id="count">Count: {store.count}</p>
}
