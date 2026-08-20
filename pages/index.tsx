import Image from 'next/image'
import img from '../public/test.png'

export default function Home() {
  return (
    <main>
      <h1>next/image blurWidth/blurHeight repro</h1>
      <Image id="plain" src={img} alt="plain" />
      <Image id="blur" src={img} alt="blur" placeholder="blur" />
      <img id="spread" {...(img as any)} alt="spread" />
      <pre id="json">{JSON.stringify(img)}</pre>
    </main>
  )
}
