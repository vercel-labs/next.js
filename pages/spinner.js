import Image from 'next/image'
import { useEffect, useState } from 'react'
export default function Spinner() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])
  return (
    <main>
      <h1>priority loading spinner that unmounts</h1>
      {loading ? (
        <Image src="/ball.png" alt="loading ball" width={50} height={50} priority />
      ) : (
        <p>done</p>
      )}
    </main>
  )
}
