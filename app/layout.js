import { Suspense } from 'react'

async function RootLayoutInner({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// Wrapping the async root layout in Suspense (the common workaround for the
// dynamicIO / cacheComponents "accessed data without a Suspense boundary" error)
export default function RootLayout({ children }) {
  return (
    <Suspense>
      <RootLayoutInner>{children}</RootLayoutInner>
    </Suspense>
  )
}
