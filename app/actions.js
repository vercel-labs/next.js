'use server'

export async function markRead(id) {
  console.log('server action START', id)
  await new Promise((r) => setTimeout(r, 300))
  console.log('server action DONE', id)
  return { ok: true }
}
