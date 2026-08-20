import Image from 'next/image'

export default function PagesRouter() {
  return (
    <main>
      <h2>1. priority (preload expected)</h2>
      <Image src="https://picsum.photos/seed/priority/400/300" alt="a" width={400} height={300} priority />
      <h2>2. loading=&quot;eager&quot; only (NO preload expected)</h2>
      <Image src="https://picsum.photos/seed/eager/400/300" alt="b" width={400} height={300} loading="eager" />
      <h2>3. plain img loading=&quot;eager&quot;</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://picsum.photos/seed/plain/400/300" alt="d" width={400} height={300} loading="eager" />
    </main>
  )
}
