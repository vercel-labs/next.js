import 'azure-maps-control/dist/atlas.min.css'
import { useEffect, useRef } from 'react'

export default function Lazy() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let map: any
    ;(async () => {
      const atlas = await import('azure-maps-control')
      map = new atlas.Map(ref.current!, {
        center: [-122.33, 47.6],
        zoom: 12,
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY || 'REPLACE_WITH_AZURE_MAPS_KEY',
        },
      })
    })()
    return () => map?.dispose()
  }, [])
  return <div id="map" ref={ref} style={{ width: '100%', height: 400 }} />
}
