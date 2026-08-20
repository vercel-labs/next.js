import { Suspense } from 'react'
import { Todos } from './todos'

async function getTodos() {
  await new Promise((res) => setTimeout(res, 50))
  return { data: [{ name: 'Todo 1' }, { name: 'Todo 2' }] }
}

export default function Page() {
  const todos = getTodos()
  return (
    <main>
      <h1>TODOs Page</h1>
      <Suspense fallback={<h2>Loading ...</h2>}>
        <Todos todos={todos} />
      </Suspense>
    </main>
  )
}
