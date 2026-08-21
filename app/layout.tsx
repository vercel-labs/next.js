import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'repro',
  icons: {
    icon: [{ url: '/parent-icon.png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
