import Link from 'next/link'

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/photo/1" id="modal-link">
            Open photo 1 (intercepted modal)
          </Link>
        </nav>
        {children}
        {modal}
      </body>
    </html>
  )
}
