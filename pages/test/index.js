import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

const Inner = dynamic(() => import('../../components/Inner'), { ssr: false })

export default function Test() {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  return (
    <div>
      <h1 id="title">test page {n}</h1>
      <button id="btn" onClick={() => setN((v) => v + 1)}>
        rerender
      </button>
      <Inner ref={ref} />
    </div>
  )
}
