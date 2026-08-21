// @ts-ignore
import fooRaw from '!!raw-loader!./foo.css'

export default function Page() {
  return (
    <main>
      <h1 id="title">raw-loader CSS repro</h1>
      <pre id="raw">{fooRaw}</pre>
    </main>
  )
}
