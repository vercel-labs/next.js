'use client'

import { useState, type ReactNode } from 'react'

export function ProviderClient({ children }: { children?: ReactNode }) {
  const [enabled] = useState(true)

  return (
    <section id="provider" data-enabled={String(enabled)}>
      {children}
    </section>
  )
}
