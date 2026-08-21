import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('../components/MapView'), { ssr: false })

export default function Home() {
  return (
    <>
      <h1 id="heading">Azure Maps + Turbopack repro (issue #88501)</h1>
      <MapView />
    </>
  )
}
