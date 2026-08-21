'use server'

export async function addTodo(text) {
  const id = Math.random().toString(36).slice(2, 8)
  console.log(`[server] addTodo START id=${id} text=${text} at ${new Date().toISOString()}`)
  await new Promise((res) => setTimeout(res, 10000))
  console.log(`[server] addTodo FINISHED id=${id} at ${new Date().toISOString()} (never aborted)`)
  return { id, text }
}
