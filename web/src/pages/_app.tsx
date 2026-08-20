import { foo } from '@repro/shared/src/consts/common'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <h1>App {foo}</h1>
    <Component {...pageProps} />
  </>
)

export default App
