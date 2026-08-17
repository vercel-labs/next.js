import type { IncrementalCache } from '../../lib/incremental-cache'

import { unstable_cache } from './unstable-cache'

function createIncrementalCache() {
  const entries = new Map<string, any>()
  const cacheKeys: string[] = []

  const incrementalCache = {
    isOnDemandRevalidate: false,
    async generateSimpleCacheKey(invocationKey: string) {
      cacheKeys.push(invocationKey)
      return invocationKey
    },
    async get(cacheKey: string) {
      const value = entries.get(cacheKey)
      return value ? { value, isStale: false } : null
    },
    async set(cacheKey: string, value: any) {
      entries.set(cacheKey, value)
    },
  } as unknown as IncrementalCache

  return { incrementalCache, cacheKeys }
}

const items = ['apple', 'banana', 'cherry']

function sort(sortOrder: string | undefined) {
  return sortOrder === 'desc' ? [...items].reverse() : items
}

describe('unstable_cache', () => {
  let cacheKeys: string[]

  beforeEach(() => {
    const cache = createIncrementalCache()
    cacheKeys = cache.cacheKeys
    ;(globalThis as any).__incrementalCache = cache.incrementalCache
  })

  afterEach(() => {
    delete (globalThis as any).__incrementalCache
  })

  it('should create distinct cache entries for distinct plain object arguments', async () => {
    const getItems = unstable_cache(
      async (options: { sortOrder: string }) => sort(options.sortOrder),
      ['object-args']
    )

    expect(await getItems({ sortOrder: 'asc' })).toEqual([
      'apple',
      'banana',
      'cherry',
    ])
    expect(await getItems({ sortOrder: 'desc' })).toEqual([
      'cherry',
      'banana',
      'apple',
    ])
    expect(new Set(cacheKeys).size).toBe(2)
  })

  it('should create distinct cache entries for distinct Map arguments', async () => {
    const getItems = unstable_cache(
      async (options: Map<string, string>) => sort(options.get('sortOrder')),
      ['map-args']
    )

    expect(await getItems(new Map([['sortOrder', 'asc']]))).toEqual([
      'apple',
      'banana',
      'cherry',
    ])
    expect(await getItems(new Map([['sortOrder', 'desc']]))).toEqual([
      'cherry',
      'banana',
      'apple',
    ])
    expect(new Set(cacheKeys).size).toBe(2)
  })

  it('should create distinct cache entries for distinct Set arguments', async () => {
    const getItems = unstable_cache(
      async (options: Set<string>) =>
        sort(options.has('desc') ? 'desc' : 'asc'),
      ['set-args']
    )

    expect(await getItems(new Set(['asc']))).toEqual([
      'apple',
      'banana',
      'cherry',
    ])
    expect(await getItems(new Set(['desc']))).toEqual([
      'cherry',
      'banana',
      'apple',
    ])
    expect(new Set(cacheKeys).size).toBe(2)
  })
})
