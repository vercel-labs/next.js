import { redirect } from 'next/navigation'

export async function GET() {
  try {
    redirect('/target')
  } catch {
    // silently swallowed, handler returns nothing
  }
}
