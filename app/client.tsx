'use client'

import { useEffect } from 'react'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

class Foo {
  x = 1
  y = 'two'
}

function run(name: string, fn: () => void) {
  try {
    fn()
  } catch (e) {
    document.body.append(
      Object.assign(document.createElement('pre'), {
        textContent: `${name} THREW: ${(e as Error).name}: ${(e as Error).message}`,
      })
    )
  }
}

export default function Client() {
  useEffect(() => {
    run('CASE-1 plain-object', () => console.log('CASE-1', { a: 1, b: 'two' }))
    run('CASE-2 bigint', () => console.log('CASE-2', { big: 123n }))
    run('CASE-3 class-instance', () => console.log('CASE-3', new Foo()))
    run('CASE-4 dom-element', () => console.log('CASE-4', document.body))
    run('CASE-5 map-set', () =>
      console.log('CASE-5', new Map([['a', 1]]), new Set([1, 2])))
    run('CASE-6 trpc-proxy', () => {
      const trpc: any = createTRPCClient<any>({
        links: [httpBatchLink({ url: '/api/trpc' })],
      })
      console.log('CASE-6', trpc)
    })
    run('CASE-7 revoked-proxy', () => {
      const { proxy, revoke } = Proxy.revocable({ a: 1 }, {})
      revoke()
      console.log('CASE-7', proxy)
    })
    run('CASE-8 after', () => console.log('CASE-8 done'))
  }, [])
  return <p>open the terminal</p>
}
