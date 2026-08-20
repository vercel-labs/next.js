import Head from 'next/head'
import Link from 'next/link'

export default function Other() {
  return (
    <>
      <Head>
        <title>Page B</title>
        <meta name="description" content="desc B" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1>Page B</h1>
      <Link href="/" id="to-home">to home</Link>
    </>
  )
}
