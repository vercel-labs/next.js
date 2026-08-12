import { revalidatePath } from 'next/cache'

let counter = 0

async function increment() {
  'use server'
  counter += 1
  revalidatePath('/')
}

export default function Page() {
  return (
    <main>
      <p id="count">count: {counter}</p>
      <form action={increment}>
        <button type="submit">increment</button>
      </form>
    </main>
  )
}
