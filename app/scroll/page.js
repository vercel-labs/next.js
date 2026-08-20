import Image from 'next/image'
export default function P() {
  return (
    <>
      <div style={{ height: '30000px' }}>spacer</div>
      <Image src="/ball.png" alt="a" width={400} height={400} priority loading="lazy" />
    </>
  )
}
