import Image from 'next/image'
export default function P() {
  return (
    <>
      <div style={{ height: '30000px' }}>spacer</div>
      <Image src="/wide.png" alt="a" width={800} height={300} preload loading="lazy" />
    </>
  )
}
