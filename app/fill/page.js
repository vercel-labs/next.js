import Image from 'next/image'
export default function P() {
  return (
    <div style={{ position: 'relative', width: '50vw', height: '300px' }}>
      <Image src="/ball.png" alt="a" fill sizes="50vw" priority />
    </div>
  )
}
