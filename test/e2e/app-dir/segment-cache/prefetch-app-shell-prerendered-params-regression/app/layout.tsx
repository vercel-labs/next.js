import { Suspense } from 'react'
import { cookies } from 'next/headers'

// A personalized hole in the shared chrome, like a session indicator in a
// header. It's behind <Suspense>, so every route still gets a prerendered
// shell.
async function Session() {
  const jar = await cookies()
  return (
    <span id="session">
      {jar.get('session')?.value ?? 'session: anonymous'}
    </span>
  )
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html>
      <body>
        <Suspense
          fallback={<span id="session-fallback">Loading session…</span>}
        >
          <Session />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
