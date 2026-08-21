import Link from 'next/link'
export default function Home() {
  return (<div>
    <Link id="to-list" href="/list/1">soft nav to /list/1</Link>{' | '}
    <Link id="to-section" href="/photos">/photos</Link>
  </div>)
}
