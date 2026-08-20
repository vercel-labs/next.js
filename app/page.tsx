import { Form } from './form'

async function getData(key: string, tag: string) {
  const res = await fetch(`http://127.0.0.1:4001/data?key=${key}`, {
    next: { tags: [tag] },
  })
  return res.json()
}

async function Todos() {
  const data = await getData('todos', 'todos')
  return <p id="todos">todos fetch count: {data.count}</p>
}

async function Other() {
  const data = await getData('other', 'other-tag')
  return <p id="other">other fetch count: {data.count}</p>
}

export default function Page() {
  return (
    <main>
      <Todos />
      <Other />
      <Form />
    </main>
  )
}
