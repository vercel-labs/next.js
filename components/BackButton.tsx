import Link from 'next/link'
import type { Route } from 'next'

type Props<T extends string> = {
  href: Route<T> | URL
}

export function BackButton<T extends string>({ href }: Props<T>) {
  return <Link href={href}>Back</Link>
}
