import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Page A</title>
        <meta name="description" content="desc A" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1>Page A</h1>
      <Link href="/other" id="to-other">to other</Link>
    </>
  )
}
