export const metadata = { title: 'next/font + font-feature-settings' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 24 }}>{children}</body>
    </html>
  )
}
