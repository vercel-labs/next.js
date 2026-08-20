export default function RootLayout({
  list,
  detail,
}: {
  children: React.ReactNode
  list: React.ReactNode
  detail: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', gap: 40 }}>
          <div id="list-slot">{list}</div>
          <div id="detail-slot">{detail}</div>
        </div>
      </body>
    </html>
  )
}
