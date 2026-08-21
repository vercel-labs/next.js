export const metadata = { title: 'next#78118 font hinting repro' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#fff', color: '#000' }}>
        {children}
      </body>
    </html>
  )
}
