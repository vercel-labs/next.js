import { ReactNode } from 'react'

export const metadata = {
  title: { default: 'Home Default', template: '%s | Site' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
