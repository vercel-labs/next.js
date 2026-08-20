import Link from 'next/link'
import React from 'react'

export const metadata = { title: 'repro 49427' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui' }}>{children}</body>
    </html>
  )
}
