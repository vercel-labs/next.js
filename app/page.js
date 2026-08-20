import Image from 'next/image'
import img from "../transparent.png"

export default function Page() {
  return (
    <main>
      <h1 style={{ fontFamily: 'sans-serif' }}>#53329 blur placeholder</h1>
      {/* Transparent PNG (colored circle on transparent background) with blur placeholder */}
      <Image id="target" src={img} alt="transparent circle" priority placeholder="blur" />
    </main>
  )
}
