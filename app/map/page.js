import Link from 'next/link'
import MapView from './map-view'

export default function MapPage() {
  return (
    <main>
      <h1>Map</h1>
      <Link id="to-home" href="/">
        Go to /
      </Link>
      <MapView />
    </main>
  )
}
