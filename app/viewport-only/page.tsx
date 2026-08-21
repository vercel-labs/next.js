import type { Viewport } from 'next'

export const viewport = {
  themeColor: 'black',
} satisfies Viewport

export default function Page() {
  return <h1>viewport</h1>
}
