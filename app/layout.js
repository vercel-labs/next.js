export const metadata = { title: 'revalidateTag router cache repro' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
