import Image from 'next/image'

const BASE = 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png'

export default function Page() {
  return (
    <main>
      <h1>next/image remotePatterns search:&apos;&apos; repro</h1>
      <p id="no-query">no query string:</p>
      <Image id="img-no-query" src={BASE} width={180} height={180} alt="no query" />
      <p id="with-query">with query string (?v=1):</p>
      <Image id="img-with-query" src={`${BASE}?v=1`} width={180} height={180} alt="with query" />
    </main>
  )
}
