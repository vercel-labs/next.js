import Link from 'next/link'

export function getServerSideProps() {
  return { props: { hello: 'world' } }
}

export default function Home() {
  return (
    <div>
      <h1>home</h1>
      <Link href="/other">to other</Link>
    </div>
  )
}
