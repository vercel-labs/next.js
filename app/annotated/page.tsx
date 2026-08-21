import type { Metadata, Viewport } from 'next'

// Case B: type annotation — no warning (control)
export const metadata: Metadata = {
  title: 'My Website',
}

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function Page() {
  return <h1>ok</h1>
}
