import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

let linkChildRenders = 0
let plainChildRenders = 0

const MyButton = React.memo(function MyButton({ label, ...rest }) {
  linkChildRenders++
  return (
    <button id="link-child" {...rest}>
      {label} (renders: {linkChildRenders})
    </button>
  )
})

const PlainButton = React.memo(function PlainButton({ label }) {
  plainChildRenders++
  return (
    <button id="plain-child">
      {label} (renders: {plainChildRenders})
    </button>
  )
})

export default function Home() {
  const router = useRouter()
  const updateTime = React.useCallback(() => {
    router.push({ pathname: '/', query: { t: Date.now() } }, undefined, {
      shallow: true,
    })
  }, [router])

  return (
    <main>
      <button id="update-time" onClick={updateTime}>
        Update Time
      </button>
      <p id="query">query: {JSON.stringify(router.query)}</p>
      <Link href="/other" legacyBehavior passHref>
        <MyButton label="Link + React.memo child" />
      </Link>
      <PlainButton label="Control React.memo child" />
      <pre id="counts">{`link:${linkChildRenders} plain:${plainChildRenders}`}</pre>
    </main>
  )
}
