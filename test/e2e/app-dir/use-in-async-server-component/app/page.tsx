import { Suspense } from 'react'
import { Todos } from './todos'

export const dynamic = 'force-dynamic'

export default function Page() {
  const todos = new Promise<string[]>((resolve) => {
    setTimeout(() => resolve(['Todo 1', 'Todo 2']), 10)
  })

  return (
    <Suspense fallback={<p id="fallback">Loading...</p>}>
      <Todos todos={todos} />
    </Suspense>
  )
}
