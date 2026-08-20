export default function SubRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <p id="sub-layout">SUB ROOT LAYOUT</p>
        {children}
      </body>
    </html>
  )
}
