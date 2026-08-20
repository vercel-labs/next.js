import Head from 'next/head'
import LazyPage from '../components/LazyPage'

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <LazyPage>
        <Component {...pageProps} />
      </LazyPage>
    </>
  )
}

export default MyApp
