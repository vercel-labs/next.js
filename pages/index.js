import Image from 'next/image'
import img from '../public/transparent.webp'

export default function Home() {
  return (
    <div style={{ background: 'white' }}>
      <h1>next/image webp + alpha</h1>
      <Image src={img} alt="transparent webp" priority />
    </div>
  )
}
