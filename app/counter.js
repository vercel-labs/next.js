'use client'
import { useState } from 'react'

export default function Counter() {
  const [items, setItems] = useState([])
  return (
    <div>
      <button id="add" onClick={() => setItems((i) => [...i, `client item ${i.length + 1}`])}>
        Add Client Item
      </button>
      <ul id="client-items">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
      <p id="client-count">client items: {items.length}</p>
    </div>
  )
}
