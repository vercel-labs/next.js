import { Suspense } from 'react'
import Slow from './slow'
export default function P() {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <Slow />
    </Suspense>
  )
}
