import { Suspense } from 'react'
import Click from '../Click'
import Lazy from '../Lazy'
import Pad from '../Pad'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <h1>without Script</h1>
      <Suspense fallback={<div id="loading">Loading...</div>}>
        <Lazy />
      </Suspense>
      <Click />
      <Pad />
    </>
  )
}
