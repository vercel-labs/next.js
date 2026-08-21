import FakeGoogleTranslate from './fake-google-translate'

// NOTE: intentionally no `title` here, mirroring the reported repro where a
// page has no title, so the route announcer announces "" for that route.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FakeGoogleTranslate />
        {children}
      </body>
    </html>
  )
}
