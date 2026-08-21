import Link from 'next/link'
import { useState } from 'react'

const nullHref = null

export default function Home() {
  const [href, setHref] = useState('/other')
  return (
    <main>
      <button onClick={() => setHref(nullHref)}>
        click me to set href to null. href is now {JSON.stringify(href)}
      </button>
      <Link href={href}>a link</Link>
    </main>
  )
}
