'use server'

export async function testAction() {
  // On Vercel this would exceed the function duration limit and yield a 504
  // FUNCTION_INVOCATION_TIMEOUT. Locally, middleware.ts simulates that response.
  await new Promise((r) => setTimeout(r, 100))
  return { ok: true }
}
