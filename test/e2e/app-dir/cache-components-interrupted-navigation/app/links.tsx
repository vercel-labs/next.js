'use client'
import Link from 'next/link'

export function Links() {
  return (
    <div>
      <Link id="link-a" href="/a" prefetch={false}>
        A
      </Link>{' '}
      <Link id="link-b" href="/b" prefetch={false}>
        B
      </Link>{' '}
      <Link id="link-c" href="/c" prefetch={false}>
        C
      </Link>
    </div>
  )
}
