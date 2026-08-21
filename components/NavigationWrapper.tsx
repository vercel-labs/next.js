'use client'

import { HeaderCard } from './HeaderCard'

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderCard>HeaderCard in root layout: should be YELLOW background</HeaderCard>
      <main>{children}</main>
    </>
  )
}
