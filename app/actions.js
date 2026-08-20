'use server'

export async function slowAction() {
  await new Promise((r) => setTimeout(r, 4000))
  return 'action done'
}
