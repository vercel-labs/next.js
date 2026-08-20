import Image from 'next/image'
export default function Page() {
  return <Image src="/big.jpg" alt="big" width={2000} height={1200} sizes="100vw" />
}
