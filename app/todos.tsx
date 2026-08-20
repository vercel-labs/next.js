import { use } from 'react'

type Props = { todos: Promise<{ data: { name: string }[] }> }

// Async Server Component that calls `use()` instead of `await`
export const Todos = async (props: Props) => {
  const todos = use(props.todos)

  return (
    <ul>
      {todos.data.map((todo, idx) => (
        <li key={idx}>{todo.name}</li>
      ))}
    </ul>
  )
}
