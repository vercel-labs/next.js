export default function RootLayout({
  children,
  card,
}: {
  children: React.ReactNode
  card: React.ReactNode
}) {
  return (
    <html>
      <body>
        <h1>root layout</h1>
        <div id="children">{children}</div>
        <div id="card">{card}</div>
      </body>
    </html>
  )
}
