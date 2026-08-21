export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <header
          id="layout-header"
          style={{
            height: 300,
            background: 'tomato',
            fontSize: 40,
            padding: 20,
          }}
        >
          LAYOUT HEADER (300px tall, rendered by layout.tsx)
        </header>
        {children}
      </body>
    </html>
  )
}
