export const metadata = {
  title: 'Root',
  description: 'ROOT DESCRIPTION',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <a href="/">Home</a> | <a href="/about">About</a> |{' '}
        <a href="/dashboard">Dashboard</a>
        {children}
      </body>
    </html>
  )
}
