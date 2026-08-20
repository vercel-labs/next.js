import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html style={{ scrollBehavior: 'smooth' }}>
      <head />
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
