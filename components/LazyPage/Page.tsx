import Link from 'next/link'
import { JSX, ReactNode } from 'react'

export default function Page({
  children,
}: {
  children?: ReactNode
}): JSX.Element | null {
  return (
    <>
      <Link href="/from">Page With Link to Lazy</Link>
      <br />
      <Link href="/to">Page without link to lazy</Link>
      {children}
    </>
  )
}
