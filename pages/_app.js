import App from 'next/app'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  console.log('APP GIP ran for', appContext.ctx.pathname)
  appContext.ctx.res.setHeader('x-test', 'test-value')
  appContext.ctx.res.setHeader('Cache-Control', 'private, max-age=999')
  return { ...appProps }
}

export default MyApp
