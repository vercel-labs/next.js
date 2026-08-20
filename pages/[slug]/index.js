import { useRouter } from 'next/router'
export default function Slug() {
  const r = useRouter()
  return <pre id="out">{JSON.stringify({ page: 'slug', pathname: r.pathname, asPath: r.asPath, locale: r.locale, query: r.query }, null, 2)}</pre>
}
