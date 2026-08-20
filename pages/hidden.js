import Image from 'next/image'
export default function Hidden() {
  return (
    <main>
      <h1>priority image inside display:none parent</h1>
      <div style={{ display: 'none' }}>
        <Image src="/ball.png" alt="ball" width={50} height={50} priority />
      </div>
    </main>
  )
}
