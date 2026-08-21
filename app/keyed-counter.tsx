'use client'

import { useRouter } from 'next/navigation'
import { Counter } from './counter'

export function KeyedCounter() {
  const router = useRouter() as ReturnType<typeof useRouter> & {
    bfcacheId?: string
  }
  return <Counter key={router.bfcacheId} />
}
