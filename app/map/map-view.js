'use client'

import { useEffect, useRef, useState } from 'react'
import { FakeMap, Marker } from '../fake-map-gl'

export default function MapView() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [ready, setReady] = useState(false)

  // Typical "create once" pattern used by react-map-gl / Leaflet wrappers.
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new FakeMap(containerRef.current)
      console.log('[repro] map created')
    } else {
      console.log('[repro] map effect re-ran, reusing existing instance')
    }
    setReady(true)
    return () => {
      console.log('[repro] map cleanup -> map.remove()')
      mapRef.current.remove()
    }
  }, [])

  // Second effect adds a marker to whatever map instance is around.
  useEffect(() => {
    if (!ready) return
    const marker = new Marker().addTo(mapRef.current)
    console.log('[repro] marker added')
    return () => marker.remove()
  }, [ready])

  return <div id="map-container" ref={containerRef} style={{ height: 200 }} />
}
