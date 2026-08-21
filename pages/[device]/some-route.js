import { useRouter } from 'next/router'

export default function SomeRoute() {
  const router = useRouter()
  return (
    <div>
      <h1 id="page">SOME-ROUTE</h1>
      <pre id="state">
        {JSON.stringify({
          pathname: router.pathname,
          asPath: router.asPath,
          query: router.query,
        })}
      </pre>
      <button
        id="push-shallow"
        onClick={() =>
          router.push(
            { query: { ...router.query, n: String(Number(router.query.n || 0) + 1) } },
            undefined,
            { shallow: true }
          )
        }
      >
        push shallow (buggy: query only)
      </button>
      <button
        id="push-shallow-pathname"
        onClick={() =>
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, n: String(Number(router.query.n || 0) + 1) },
            },
            undefined,
            { shallow: true }
          )
        }
      >
        push shallow (workaround: explicit pathname)
      </button>
    </div>
  )
}
