import { Suspense, type ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
