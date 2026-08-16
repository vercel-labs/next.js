'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { markRead } from './actions'

export default function List({ ids }) {
  const [, startTransition] = useTransition()
  const [log, setLog] = useState([])
  const add = (line) => setLog((l) => [...l, line])
  return (
    <>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            {/* href === current path */}
            <Link
              id={'item-' + id}
              href="/"
              onClick={() => {
                add('calling action ' + id)
                startTransition(async () => {
                  const res = await markRead(id)
                  add('action settled ' + id + ' ' + JSON.stringify(res))
                })
              }}
            >
              item {id}
            </Link>
          </li>
        ))}
      </ul>
      <pre id="log">{log.join('\n')}</pre>
    </>
  )
}
