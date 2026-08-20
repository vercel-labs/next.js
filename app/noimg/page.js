import Image from 'next/image'
export default function P() {
  return (
    <div style={{ width: '150px' }}>
      <Image src="/wide.png" alt="a" width={800} height={300} sizes="auto" loading="lazy" style={{ width: '150px', height: 'auto' }} />
    </div>
  )
}
