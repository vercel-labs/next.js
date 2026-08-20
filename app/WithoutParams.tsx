'use client'
import { bump } from './counters'

export function WithoutParams() {
  const n = bump('plain')
  return <div id="plain">plain renders: {n}</div>
}
