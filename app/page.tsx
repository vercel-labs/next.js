export default function Home() {
  // Static URL.parse() (Node >= 20.18 / 22, Safari >= 18) - unpolyfilled by Next.js
  const hasParse = typeof (URL as any).parse === 'function'
  const hasCanParse = typeof (URL as any).canParse === 'function'
  return (
    <main>
      <h1>URL.parse polyfill repro</h1>
      <p id="server">
        server: URL.parse={String(hasParse)} URL.canParse={String(hasCanParse)}
      </p>
    </main>
  )
}
