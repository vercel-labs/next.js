import { isConflict, readDoc } from './read-doc'
import type { Container, Doc } from './types'

const CASH_GAME_STATS_SCHEMA_VERSION = 3

function cashGameStatsId(mode: string): string {
  return `cash-game-stats:${mode}`
}

function emptyStatsDoc({
  userId,
  mode,
}: {
  userId: string
  mode: string
  now: number
}): Doc {
  return {
    id: cashGameStatsId(mode),
    userId,
    mode,
    schemaVersion: CASH_GAME_STATS_SCHEMA_VERSION,
    branch: 'created-by-null-guard',
  }
}

async function migrateCashGameStatsDoc({ doc }: { container: Container; doc: Doc; now: number }): Promise<Doc> {
  return {
    ...doc,
    schemaVersion: CASH_GAME_STATS_SCHEMA_VERSION,
    branch: 'migrated-existing-document',
  }
}

async function readCashGameStatsDoc(
  userId: string,
  mode: string,
  container: Container,
): Promise<Doc | null> {
  return readDoc<Doc>({
    container,
    id: cashGameStatsId(mode),
    partitionKey: userId,
  })
}

export async function ensureCashGameStatsDoc({
  container,
  mode,
  now,
  userId,
}: {
  container: Container
  mode: string
  now: number
  userId: string
}): Promise<Doc> {
  const existing = await readCashGameStatsDoc(userId, mode, container)

  if (!existing) {
    const created = emptyStatsDoc({ userId, mode, now })
    try {
      await container.items.create(created)
    } catch (error) {
      if (isConflict(error)) {
        return (await readCashGameStatsDoc(userId, mode, container)) ?? created
      }
      throw error
    }
    return created
  }

  if ((existing.schemaVersion ?? 1) >= CASH_GAME_STATS_SCHEMA_VERSION) return existing
  return migrateCashGameStatsDoc({ container, doc: existing, now })
}
