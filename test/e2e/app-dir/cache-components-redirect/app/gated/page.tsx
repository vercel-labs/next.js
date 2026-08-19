import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const instant = false

export default async function Gated() {
  await cookies()
  // Stands in for a database read or a fetch. Awaiting here means the redirect
  // is decided after the shell has already been flushed, so it can only be
  // communicated inside the streamed body.
  await new Promise((resolve) => setTimeout(resolve, 300))
  redirect('/destination')
}
