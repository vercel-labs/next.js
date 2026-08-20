import '../../../version-check.js'

export const runtime = 'edge'

export function GET() {
  return Response.json({ version: process.version ?? null })
}
