import { ensureCashGameStatsDoc } from '../../../lib/cash-game-stats'
import { makeContainer } from '../../../lib/container'

export const dynamic = 'force-dynamic'

export async function GET() {
  const log: string[] = []
  const doc = await ensureCashGameStatsDoc({
    container: makeContainer(log),
    mode: 'cash',
    now: new Date().toISOString(),
    userId: 'missing-user',
  })
  return Response.json({ doc, log })
}
