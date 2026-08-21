import type { Metadata, Viewport } from 'next'

// Case A: `satisfies` — plugin still warns (BUG)
export const metadata = {
  title: 'My Website',
} satisfies Metadata

export const viewport = {
  themeColor: 'black',
} satisfies Viewport

export default function Page() {
  return <h1>{metadata.title}</h1>
}
