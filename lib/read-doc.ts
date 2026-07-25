import type { Container } from './container'

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

function isNotFound(error: unknown): boolean {
  return error instanceof Error && 'statusCode' in error && error.statusCode === 404
}
