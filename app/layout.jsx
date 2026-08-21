import Menu from './menu'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Menu />
        {children}
      </body>
    </html>
  )
}
