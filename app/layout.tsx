export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('[server] ROOT LAYOUT RENDERED', new Date().toISOString())
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
