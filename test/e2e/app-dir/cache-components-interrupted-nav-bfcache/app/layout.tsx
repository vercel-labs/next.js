import type { ReactNode } from 'react'
import { Links } from './links'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Links />
        {children}
      </body>
    </html>
  )
}
