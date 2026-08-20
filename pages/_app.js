import { StoreProvider } from '../components/StoreProvider'
let count = 0
export default function App({ Component, pageProps }) {
  count++
  if (typeof window !== 'undefined') {
    window.__appRenders = count
    console.log('APP RENDER', count)
  }
  return (
    <StoreProvider {...pageProps}>
      <Component {...pageProps} />
    </StoreProvider>
  )
}
