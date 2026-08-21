'use client'
import { useState } from 'react'
import { makeId } from './actions'
export function AiWidget() {
  const [n, setN] = useState(0)
  return <button type="button" onClick={async () => { await makeId(); setN(n + 1) }}>ext {n}</button>
}
