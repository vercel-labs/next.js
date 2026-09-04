import { use } from 'react'

// Calling `use()` inside an `async` Server Component is invalid, but it must
// not hang the request (or crash the server) - see
// https://github.com/vercel/next.js/issues/42469
export async function Todos({ todos }: { todos: Promise<string[]> }) {
  const list = use(todos)

  return (
    <ul id="todos">
      {list.map((todo) => (
        <li key={todo}>{todo}</li>
      ))}
    </ul>
  )
}
