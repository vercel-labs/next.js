import Image from 'next/image'
export default function Basic() {
  return (
    <main>
      <h1>basic priority image</h1>
      <Image src="/ball.png" alt="ball" width={50} height={50} priority />
    </main>
  )
}
