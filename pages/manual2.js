import Head from 'next/head'
export default function Manual2() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" imageSrcSet="/_next/image?url=%2Fball.png&w=256&q=75 1x, /_next/image?url=%2Fball.png&w=384&q=75 2x" />
      </Head>
      <h1>manual unused imagesrcset preload (control 2)</h1>
    </>
  )
}
