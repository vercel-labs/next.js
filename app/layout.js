import './globals.css'

export const metadata = { title: 'repro-82170' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
