import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <p id="home-marker">home page</p>
      <p>
        <Link id="to-map" href="/map">
          Go to /map (buggy: reuses destroyed instance)
        </Link>
      </p>
      <p>
        <Link id="to-map-fixed" href="/map-fixed">
          Go to /map-fixed (recreates instance in the effect)
        </Link>
      </p>
    </main>
  )
}
