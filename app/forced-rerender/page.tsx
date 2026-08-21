import Script from 'next/script'
import { Widget } from '../components/Widget'

export default function Page() {
  return (
    <>
      <Script src="/my-element.js" />
      <h1>next/script + forced re-render</h1>
      <Widget forceRerender />
    </>
  )
}
