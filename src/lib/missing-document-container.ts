import type { Container } from './types'

let createCount = 0

export const missingDocumentContainer: Container = {
  item() {
    return {
      async read<T>() {
        return { resource: null as T | null }
      },
    }
  },
  items: {
    async create<T>(document: T) {
      createCount += 1
      return { resource: document }
    },
  },
}

export function getCreateCount(): number {
  return createCount
}
