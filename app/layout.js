import Header from './header'
export default function RootLayout({ children }) {
  console.log('layout')
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
