'use client'

import { useEffect, useRef, useState } from 'react'
import { FakeMap, Marker } from '../fake-map-gl'

// Fixed variant: the instance is (re)created inside the effect, so an Activity
// reappear (or a Strict Mode double-invoke) builds a brand new instance instead
// of reusing the destroyed one.
export default function MapViewFixed() {
  const containerRef = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    const instance = new FakeMap(containerRef.current)
    console.log('[repro-fixed] map created')
    setMap(instance)
    return () => {
      console.log('[repro-fixed] map cleanup -> map.remove()')
      instance.remove()
      setMap(null)
    }
  }, [])

  useEffect(() => {
    if (!map) return
    const marker = new Marker().addTo(map)
    console.log('[repro-fixed] marker added')
    return () => marker.remove()
  }, [map])

  return <div id="map-container" ref={containerRef} style={{ height: 200 }} />
}
