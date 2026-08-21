import { refreshHealth } from './actions'

async function get(path: string, tag: string) {
  const res = await fetch(`http://localhost:4000/${path}`, { next: { tags: [tag] } })
  return res.json()
}

export default async function Home() {
  const health = await get('health', 'health')
  const todos = await get('todos', 'todos')
  return (
    <div>
      <p id="health">health: {health.value}</p>
      <p id="todos">todos: {todos.value}</p>
      <form action={refreshHealth}>
        <button id="btn" type="submit">revalidateTag(&quot;health&quot;)</button>
      </form>
    </div>
  )
}
