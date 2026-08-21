'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { Route } from 'next'

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const go = (p: Route) => router.push(p)

  // Expected: pathname should be assignable to Route with typedRoutes enabled.
  // Actual: TS2345 Argument of type 'string' is not assignable to parameter of type 'Route'
  go(pathname)

  // Same problem for router.push / Link with a runtime string
  router.push(pathname)

  return <Link href={pathname}>self</Link>
}
