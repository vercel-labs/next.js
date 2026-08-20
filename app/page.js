import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <h1>next/image memory repro</h1>
      <Image src="/big.jpg" alt="big" width={1200} height={800} priority />
    </main>
  )
}
