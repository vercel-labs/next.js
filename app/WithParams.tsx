'use client'
import { useParams } from 'next/navigation'
import { bump } from './counters'

export function WithParams() {
  useParams()
  const n = bump('withParams')
  return <div id="with-params">useParams renders: {n}</div>
}
