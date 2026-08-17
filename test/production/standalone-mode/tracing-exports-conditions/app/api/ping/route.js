import { name } from 'conditional-exports-pkg'

export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({ name })
}
