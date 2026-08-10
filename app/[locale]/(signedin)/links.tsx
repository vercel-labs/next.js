'use client'
import Link from 'next/link'
import { useState } from 'react'

function HoverLink({ href, id, children }: any) {
  const [prefetch, setPrefetch] = useState<false | undefined>(false)
  return (
    <Link id={id} href={href} prefetch={prefetch} onMouseEnter={() => setPrefetch(undefined)}>
      {children}
    </Link>
  )
}

export function Links() {
  return (
    <div>
      <HoverLink id="link-a" href="/a">A</HoverLink>{' '}
      <HoverLink id="link-b" href="/b">B</HoverLink>{' '}
      <HoverLink id="link-c" href="/c">C</HoverLink>
    </div>
  )
}
