import { Suspense } from 'react'

const box = (color, label) => (
  <div
    id={label}
    elementtiming={label}
    style={{
      position: 'fixed',
      inset: 0,
      background: color,
      color: '#fff',
      fontSize: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {label}
  </div>
)

async function Slow({ searchParams }) {
  const sp = await searchParams
  const delay = Number(sp?.delay ?? 3000)
  await new Promise((r) => setTimeout(r, delay))
  return box('green', 'content')
}

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={box('red', 'loading')}>
      <Slow searchParams={searchParams} />
    </Suspense>
  )
}
