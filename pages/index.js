import dynamic from 'next/dynamic'
import { useState } from 'react'

// NOTE: promise passed directly (not a factory function)
const DynamicHeader = dynamic(import('../components/Header'), {
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  const [showHeader, setShowHeader] = useState(false)
  return (
    <div>
      <div>hello from client</div>
      <button onClick={() => setShowHeader(true)}>Show Header</button>
      {showHeader ? <DynamicHeader /> : <div>nothing</div>}
    </div>
  )
}
