'use client'

import dynamic from 'next/dynamic'

// Loaded client-side only, mirroring how the affected packages are used.
const PayloadLength = dynamic(() => import('./payload-length'), { ssr: false })

export default function Page() {
  return <PayloadLength />
}
