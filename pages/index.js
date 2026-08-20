import { useRouter } from 'next/router'
export default function Home() {
  const r = useRouter()
  return <pre id="out">{JSON.stringify({ page: 'index', pathname: r.pathname, asPath: r.asPath, locale: r.locale, query: r.query }, null, 2)}</pre>
}
