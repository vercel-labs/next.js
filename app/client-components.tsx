'use client'

import { use } from 'react'
import { getValue } from './server-actions'

let cachedPromise: Promise<string> | undefined

export function Demo() {
  cachedPromise ??= getValue()
  const value = use(cachedPromise)
  return <p id="value">{value}</p>
}
