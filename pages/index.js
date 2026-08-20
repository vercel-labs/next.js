import { useEffect, useState } from 'react'

export default function Home() {
  const [result, setResult] = useState('pending')

  useEffect(() => {
    // Initial client-side request, made as soon as the page mounts.
    fetch('/reviews')
      .then(async (res) => {
        const body = await res.text()
        const intercepted = res.headers.has('x-powered-by') === false && res.ok
        setResult(
          `status=${res.status} intercepted=${res.ok ? 'yes' : 'NO (not mocked by MSW)'} body=${body.slice(0, 80)}`
        )
      })
      .catch((error) => setResult(`error=${error.message}`))
  }, [])

  return <pre id="result">{result}</pre>
}
