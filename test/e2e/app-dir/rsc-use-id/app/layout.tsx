import { ServerId } from '../components/server-id'

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ServerId label="layout" />
        {children}
      </body>
    </html>
  )
}
