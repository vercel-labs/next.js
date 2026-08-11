import './globals.css'
export const metadata = { title: 'repro 24952' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
