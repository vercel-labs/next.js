import { getMessages } from '../lib/messages'

export default async function RootLayout({ children }) {
  // The layout awaits the same module as the page, so the dynamically imported
  // JSON file is referenced from two different route entrypoints.
  await getMessages()

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
