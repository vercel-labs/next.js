import Head from 'next/head'
import Link from 'next/link'

export default function Index() {
  return (
    <>
      <Head>
        {/* invalid tag inside next/head */}
        <html lang="en" />
        <title>Demo Page</title>
      </Head>
      <h1>Demo Page</h1>
      <Link href="/other" id="to-other">to other</Link>
    </>
  )
}
