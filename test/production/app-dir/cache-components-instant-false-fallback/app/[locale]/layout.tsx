import { cacheLife } from 'next/cache'
import type { ReactNode } from 'react'

async function getLayoutData() {
  'use cache'
  cacheLife({ stale: 300, revalidate: 60, expire: 600 })

  return 'shared layout data'
}

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode
}) {
  const data = await getLayoutData()

  return (
    <>
      <p id="layout-data">{data}</p>
      {children}
    </>
  )
}
