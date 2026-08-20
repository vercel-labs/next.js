export default function RootLayout({ children, testRoute }) {
  return (
    <html>
      <body>
        {children}
        {testRoute}
      </body>
    </html>
  )
}
