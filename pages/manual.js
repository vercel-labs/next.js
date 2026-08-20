import Head from 'next/head'
export default function Manual() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/_next/image?url=%2Fball.png&w=64&q=75" />
      </Head>
      <h1>manual unused preload (control)</h1>
    </>
  )
}
