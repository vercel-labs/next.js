import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const KEY = 'repro-log'
const read = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || '[]') } catch { return [] }
}
const add = (line) => {
  const l = read()
  l.push(`${new Date().toISOString().slice(11, 23)} ${line}`)
  sessionStorage.setItem(KEY, JSON.stringify(l.slice(-40)))
}

export default function App({ Component, pageProps }) {
  const { asPath, replace } = useRouter()
  const [log, setLog] = useState([])

  useEffect(() => {
    const entries = typeof navigation !== 'undefined' && navigation.entries ? navigation.entries().length : 'n/a'
    add(`render ${location.pathname}${location.search} | history.length=${history.length} | navigation.entries=${entries}`)
    setLog(read())
  }, [asPath])

  useEffect(() => {
    const onPop = () => add(`popstate -> ${location.pathname}${location.search} | history.length=${history.length}`)
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <nav style={{ display: 'flex', gap: 20, fontSize: 20 }}>
        <Link href="/">Home</Link>
        <Link href="/plp">PLP</Link>
        <Link
          href="/pdp"
          onClick={async () => {
            add('PDP link clicked -> router.replace(plp?t=...) then Link push /pdp')
            const [base, qs = ''] = asPath.split('?')
            const q = new URLSearchParams(qs)
            q.set('t', String(Date.now()))
            await replace(`${base}?${q.toString()}`, undefined, { shallow: true, scroll: false })
          }}
        >
          PDP
        </Link>
      </nav>
      <Component {...pageProps} />
      <p>
        <button onClick={() => { sessionStorage.removeItem(KEY); setLog([]) }}>clear log</button>{' '}
        <button onClick={() => setLog(read())}>refresh log</button>
      </p>
      <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', background: '#eee', padding: 8 }}>{log.join('\n')}</pre>
    </main>
  )
}
