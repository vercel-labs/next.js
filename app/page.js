import raw from '../data/sample.txt?raw'
import text from '../data/sample.txt?text'

export default function Page() {
  return (
    <main>
      <pre id="raw">{`?raw  -> ${JSON.stringify(raw)}`}</pre>
      <pre id="text">{`?text -> ${JSON.stringify(text)}`}</pre>
    </main>
  )
}
