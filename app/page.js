import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <h1>next/image inline style + CSP</h1>
      <Image id="img" src="/pixel.png" alt="pixel" width={100} height={100} />
    </main>
  )
}
