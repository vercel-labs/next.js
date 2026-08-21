import { auth } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  return auth.handler()
}
