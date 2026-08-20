export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  if (ctx.res) {
    ctx.res.setHeader('Cache-Control', 'private, max-age=999')
    ctx.res.setHeader('x-from-app', 'true')
  }

  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps }
}
