import Link from 'next/link'
export default function App({ Component, pageProps }) {
  return (
    <>
      <nav style={{ padding: 8, fontFamily: 'monospace' }}>
        <Link href="/">/</Link> | <Link href="/a">/a (ve)</Link> | <Link href="/b">/b (ve)</Link> |{' '}
        <Link href="/c">/c (css-modules)</Link> | <Link href="/d">/d (css-modules)</Link>
      </nav>
      <Component {...pageProps} />
    </>
  )
}
