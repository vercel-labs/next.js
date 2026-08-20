export const metadata = { title: 'nextjs-flask rewrite repro' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
