export const metadata = { title: 'next/image CSP inline style repro' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
