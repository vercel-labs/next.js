export const metadata = {
  title: { template: '%s | ROOT-TEMPLATE', default: 'ROOT-DEFAULT' },
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
