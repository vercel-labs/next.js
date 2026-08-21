import Nav from './nav'
export const metadata = { title: 'repro 95567' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: 24 }}>
        <Nav />
        <hr />
        {children}
      </body>
    </html>
  )
}
