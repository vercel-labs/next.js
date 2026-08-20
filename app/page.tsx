import Link from 'next/link'

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  const margin = 100

  return (
    <main>
      <nav style={{
        display: 'flex',
        gap: '1rem',
        height: margin,
        position: 'sticky',
        top: 0,
        background: 'salmon',
        opacity: 0.8,
      }}>
        100px header

        {/* BUG: doesn't align right below <nav> */}
        <fieldset>
          <legend>{'<Link/>'}</legend>
          <Link href="#1">1</Link> <Link href="#2">2</Link> <Link href="#3">3</Link>
        </fieldset>

        {/* EXPECTED: aligns right below <nav> */}
        <fieldset>
          <legend>{'<a/>'}</legend>
          <a href="#1">1</a> <a href="#2">2</a> <a href="#3">3</a>
        </fieldset>
      </nav>

      <div id="1" style={{ scrollMarginTop: margin, height: 800, textAlign: 'center', background: 'lightyellow' }}>1</div>
      <div id="2" style={{ scrollMarginTop: margin, height: 800, textAlign: 'center', background: 'lightgreen' }}>2</div>
      <div id="3" style={{ scrollMarginTop: margin, height: 800, textAlign: 'center', background: 'lightyellow' }}>3</div>
    </main>
  )
}
