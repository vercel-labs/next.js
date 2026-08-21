import Image from 'next/image'
import mif1 from './images/mif1.avif'
import ok from './images/sharp-avif.avif'

export default function Page() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>next/image + AVIF with major brand `mif1`</h1>
      <p>Broken (major brand mif1, compatible brands include avif):</p>
      <Image id="broken" src={mif1} alt="mif1 avif" width={64} height={64} />
      <p>Works (major brand avif):</p>
      <Image id="works" src={ok} alt="avif" width={64} height={64} />
    </main>
  )
}
