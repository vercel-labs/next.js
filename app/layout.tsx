let layoutRenders = 0

export const metadata = { title: 'repro 50163' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  layoutRenders++
  console.log('[server] RootLayout render #' + layoutRenders)
  return (
    <html lang="en">
      <body>
        <div id="layout-renders">layout-renders:{layoutRenders}</div>
        <div id="layout-id">layout-id:{Math.random().toString(36).slice(2, 10)}</div>
        {children}
      </body>
    </html>
  )
}
