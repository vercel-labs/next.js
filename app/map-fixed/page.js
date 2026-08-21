import Link from 'next/link'
import MapView from './map-view'

export default function MapFixedPage() {
  return (
    <main>
      <h1>Map (fixed)</h1>
      <Link id="to-home" href="/">
        Go to /
      </Link>
      <MapView />
    </main>
  )
}
