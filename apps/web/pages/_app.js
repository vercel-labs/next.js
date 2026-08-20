import { Callif } from '@repro/ui'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={Callif.variable}>
      <Component {...pageProps} />
    </div>
  )
}
