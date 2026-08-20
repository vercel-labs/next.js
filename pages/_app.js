// Verbatim copy of examples/with-msw/pages/_app.tsx (canary)
if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
