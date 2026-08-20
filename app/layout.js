export const metadata = { title: 'XFF spoof repro (#66305)' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
