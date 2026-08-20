import Link from 'next/link'
import type { Route } from 'next'
import type { UrlObject } from 'url'

// A: Route<T> | UrlObject
export function A<T extends string>({ href }: { href: Route<T> | UrlObject }) {
  return <Link href={href}>A</Link>
}

// B: plain URL only
export function B({ href }: { href: URL }) {
  return <Link href={href}>B</Link>
}

// C: callback returning Route<T> | URL (original report)
export function C<T extends string>({ hrefFor }: { hrefFor(p: string): Route<T> | URL }) {
  return <Link href={hrefFor('2')}>C</Link>
}

// D: Route<T> only, passing a dynamic route value
export function D<T extends string>({ href }: { href: Route<T> }) {
  return <Link href={href}>D</Link>
}
export function DUse() {
  return <D href="/pokedex/1" />
}
