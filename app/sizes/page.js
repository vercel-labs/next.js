import Image from 'next/image'
export default function P() {
  return <Image src="/ball.png" alt="a" width={400} height={400} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '33vw', height: 'auto' }} priority />
}
