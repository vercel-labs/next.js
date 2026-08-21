export const runtime = 'edge'

export function GET() {
  const hasNoColor = process.argv.includes('--no-color')
  return new Response(String(hasNoColor))
}
