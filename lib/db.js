// Simulates Prisma/BetterAuth: module-level side effect requiring a runtime env var.
if (!process.env.DATABASE_URL) {
  throw new Error(
    'Invalid `prisma.setting.findMany()` invocation: error: Environment variable not found: DATABASE_URL.'
  )
}
export const auth = { handler: () => new Response('ok') }
