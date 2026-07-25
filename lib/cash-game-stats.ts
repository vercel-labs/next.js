import { getContainerV2, type Container, type Doc } from './container'
import { readDoc } from './read-doc'

const CASH_GAME_STATS_SCHEMA_VERSION = 3

async function readCashGameStatsDoc(
  userId: string,
  mode: string,
  container: Container = getContainerV2('UserData'),
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
  now: string
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
  if ((existing.schemaVersion ?? 1) >= CASH_GAME_STATS_SCHEMA_VERSION) {
    return existing
  }
  return migrateCashGameStatsDoc({ doc: existing })
}

function cashGameStatsId(mode: string): string {
  return `stats:${mode}`
}

function emptyStatsDoc({ userId, mode }: { userId: string; mode: string; now: string }): Doc {
  return { id: `${userId}:${mode}`, schemaVersion: CASH_GAME_STATS_SCHEMA_VERSION }
}

function isConflict(error: unknown): boolean {
  return error instanceof Error && 'statusCode' in error && error.statusCode === 409
}

function migrateCashGameStatsDoc({ doc }: { container?: Container; doc: Doc; now?: string }): Doc {
  return { ...doc, schemaVersion: CASH_GAME_STATS_SCHEMA_VERSION }
}
