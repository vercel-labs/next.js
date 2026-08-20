import Link from 'next/link'
export default function Nav({ base }: { base: string }) {
  return (
    <nav>
      <Link href={`${base}/a`} id="link-a">a</Link>{' '}
      <Link href={`${base}/b`} id="link-b">b</Link>{' '}
      <Link href={`${base}/c`} id="link-c">c</Link>{' '}
      <Link href={`${base}/b#hash-target`} id="link-b-hash">b#hash</Link>
    </nav>
  )
}
