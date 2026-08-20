import singleton from '../../../lib/singleton'
export const dynamic = 'force-dynamic'
export function GET() {
  return Response.json({
    value: singleton.value,
    evalsInThisProcess: globalThis.__singletonEvals,
  })
}
