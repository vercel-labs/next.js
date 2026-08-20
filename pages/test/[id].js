import { useRouter } from 'next/router'

export default function Test() {
  const router = useRouter()
  return (
    <div>
      <h1 id="page">test page</h1>
      <pre id="query">{JSON.stringify(router.query)}</pre>
      <pre id="asPath">{router.asPath}</pre>
    </div>
  )
}
