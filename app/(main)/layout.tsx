export default function MainRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <p id="main-layout">MAIN ROOT LAYOUT</p>
        {children}
      </body>
    </html>
  )
}
