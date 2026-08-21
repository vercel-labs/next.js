import { Suspense } from 'react'
import { Demo } from './client-components'

export default function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Demo />
    </Suspense>
  )
}
