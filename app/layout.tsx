import Link from 'next/link'
import React from 'react'

export default function RootLayout({
  children,
  analytics,
  modal,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/" id="to-home">home</Link>{' '}
          <Link href="/shop" id="to-shop">shop</Link>{' '}
          <Link href="/about" id="to-about">about</Link>{' '}
          <Link href="/photo/1" id="to-photo">photo1</Link>
        </nav>
        <main id="children-slot">{children}</main>
        <aside id="analytics-slot">{analytics}</aside>
        <aside id="modal-slot">{modal}</aside>
      </body>
    </html>
  )
}
