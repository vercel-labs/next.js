import { Suspense } from 'react'

async function getTodos() {
  await new Promise((res) => setTimeout(res, 50))
  return { data: [{ name: 'Todo 1' }, { name: 'Todo 2' }] }
}

// Control: same component using `await` instead of `use()` works fine.
async function Todos({ todos }: { todos: Promise<{ data: { name: string }[] }> }) {
  const { data } = await todos
  return (
    <ul>
      {data.map((t, i) => (
        <li key={i}>{t.name}</li>
      ))}
    </ul>
  )
}

export default function Page() {
  const todos = getTodos()
  return (
    <main>
      <h1>TODOs Page (await)</h1>
      <Suspense fallback={<h2>Loading ...</h2>}>
        <Todos todos={todos} />
      </Suspense>
    </main>
  )
}
