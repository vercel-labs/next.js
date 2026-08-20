import Image from 'next/image'
import a from '../public/test-a.svg'
import b from '../public/test-b.svg'
import c from '../public/test-c.svg'

export default function Home() {
  return (
    <main>
      <h1>next/image non-integer width/height (issue #47278)</h1>
      <p>1. width=10.5 height=10.5 (both non-integer) — src test-a.svg</p>
      <Image id="both" src={a} width={10.5} height={10.5} alt="both" />
      <p>2. width=10.5 height=10 (mixed) — src test-b.svg</p>
      <Image id="mixed" src={b} width={10.5} height={10} alt="mixed" />
      <p>3. width=10 height=10 (integers, control) — src test-c.svg</p>
      <Image id="ints" src={c} width={10} height={10} alt="ints" />
    </main>
  )
}
