import { useEffect, useRef } from 'react'
import * as atlas from 'azure-maps-control'
import 'azure-maps-control/dist/atlas.min.css'

export default function MapView() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const map = new atlas.Map(ref.current, {
      center: [-122.33, 47.6],
      zoom: 12,
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY || 'REPLACE_WITH_AZURE_MAPS_KEY',
      },
    })
    return () => map.dispose()
  }, [])
  return <div id="map" ref={ref} style={{ width: '100%', height: 400 }} />
}
