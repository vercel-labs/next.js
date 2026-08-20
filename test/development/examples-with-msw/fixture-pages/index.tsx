import { useEffect, useState } from 'react'

export default function Page() {
  const [result, setResult] = useState('pending')

  useEffect(() => {
    // A request fired on the very first client render must already be handled
    // by the mocks that `pages/_app.tsx` bootstraps.
    fetch('/reviews')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          setResult(`not-mocked (status ${res.status}, type ${contentType})`)
          return
        }
        const reviews = await res.json()
        setResult(`mocked ${reviews[0].author}`)
      })
      .catch((err) => setResult(`failed ${String(err)}`))
  }, [])

  return <p id="result">{result}</p>
}
