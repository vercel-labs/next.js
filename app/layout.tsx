import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'repro 71889' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
