import Link from 'next/link'
export default function Home({ t }) {
  return (
    <div>
      <h1>Home {t}</h1>
      <Link href="/about">About</Link>
      <Link href="/blog/one">Blog one</Link>
    </div>
  )
}
export function getStaticProps() { return { props: { t: 'home' } } }
