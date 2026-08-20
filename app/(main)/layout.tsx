export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="main-layout">MAIN LAYOUT</div>
        {children}
      </body>
    </html>
  )
}
