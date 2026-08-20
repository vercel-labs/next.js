export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root-layout">ROOT LAYOUT</div>
        {children}
      </body>
    </html>
  )
}
