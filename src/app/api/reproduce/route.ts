import { ensureCashGameStatsDoc } from '../../../lib/cash-game-stats'
import { getCreateCount, missingDocumentContainer } from '../../../lib/missing-document-container'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const document = await ensureCashGameStatsDoc({
    container: missingDocumentContainer,
    mode: 'cash',
    now: Date.now(),
    userId: 'missing-user',
  })

  return Response.json({ document, createCount: getCreateCount() })
}
