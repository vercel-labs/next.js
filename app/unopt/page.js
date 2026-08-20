import Image from 'next/image'
export default function P() {
  return <Image src="/ball.png" alt="a" width={400} height={400} unoptimized priority />
}
