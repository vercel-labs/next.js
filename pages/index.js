import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Home({ time }) {
  const router = useRouter()
  return (
    <>
      <Head>
        <meta property="og:url" content={'https://example.com' + router.asPath} />
        <meta property="og:asPath" content={router.asPath} />
      </Head>
      <p id="aspath">asPath: {router.asPath}</p>
      <p id="pathname">pathname: {router.pathname}</p>
      <p id="time">generated: {time}</p>
    </>
  )
}

export async function getStaticProps() {
  return { props: { time: new Date().toISOString() }, revalidate: 5 }
}
