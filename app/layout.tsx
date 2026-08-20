export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: 24 }}>
        <h1>Navigation loading-state repro (#58261)</h1>
        {children}
      </body>
    </html>
  )
}
