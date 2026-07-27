import type { Container } from './types'

export function isNotFound(error: unknown): boolean {
  return error instanceof Error && error.message === 'not found'
}

export function isConflict(error: unknown): boolean {
  return error instanceof Error && error.message === 'conflict'
}

export async function readDoc<T>({
  container,
  id,
  partitionKey,
}: {
  container: Container
  id: string
  partitionKey: string
}): Promise<T | null> {
  try {
    const { resource } = await container.item(id, partitionKey).read<T>()
    return resource ?? null
  } catch (error) {
    if (isNotFound(error)) return null
    throw error
  }
}
