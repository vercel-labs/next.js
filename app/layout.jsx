import { Suspense } from 'react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div>Loading Page...</div>}>{children}</Suspense>
      </body>
    </html>
  )
}
