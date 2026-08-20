'use server'

export async function slowAction(label: string) {
  const start = Date.now()
  console.log(`[action ${label}] START ${new Date().toISOString()}`)
  await new Promise((r) => setTimeout(r, 1000))
  console.log(`[action ${label}] END   ${new Date().toISOString()} (${Date.now() - start}ms)`)
  return label
}
