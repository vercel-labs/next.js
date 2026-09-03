import EventProvider from './event-provider'

export const metadata = { title: 'refresh repro' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* client hook holding the EventSource lives in the shell layout */}
        <EventProvider>{children}</EventProvider>
      </body>
    </html>
  )
}
