export const metadata = { title: 'next/image blur placeholder repro (#53329)' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'limegreen' }}>{children}</body>
    </html>
  )
}
