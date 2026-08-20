import Image from 'next/image'
import { blurB64 } from './blur-b64'

const src = '/api/slow'

export default function Page() {
  return (
    <main>
      <h2 id="url-case">placeholder=&quot;blur&quot; + blurDataURL = absolute URL (bug)</h2>
      <Image
        id="img-url"
        src={src}
        alt="url blur"
        width={400}
        height={400}
        unoptimized
        placeholder="blur"
        blurDataURL="http://localhost:3000/blur.png"
      />
      <h2 id="b64-case">placeholder=&quot;blur&quot; + blurDataURL = base64 data URL (works)</h2>
      <Image
        id="img-b64"
        src={src}
        alt="base64 blur"
        width={400}
        height={400}
        unoptimized
        placeholder="blur"
        blurDataURL={blurB64}
      />
    </main>
  )
}
