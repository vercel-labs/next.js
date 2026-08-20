import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <>
      <p id="as-path">{router.asPath}</p>
      <p id="has-hash">{String(router.asPath.includes('#'))}</p>
      <p id="hydrated">{String(hydrated)}</p>
    </>
  )
}
