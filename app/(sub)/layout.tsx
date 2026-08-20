export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="sub-layout">SUB LAYOUT</div>
        {children}
      </body>
    </html>
  )
}
