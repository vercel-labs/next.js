import Link from 'next/link'
import InspectChildren from './inspect-children'
import LayoutChildMarker from './layout-child-marker'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/a">/a</Link> <Link href="/b">/b</Link>
        </nav>
        {/* Docs claim this child is `<Template key={routeParam}>` */}
        <InspectChildren label="root-layout-child">
          <LayoutChildMarker>{children}</LayoutChildMarker>
        </InspectChildren>
      </body>
    </html>
  )
}
