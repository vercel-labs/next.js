export interface Doc {
  id: string
  schemaVersion?: number
}

export interface Container {
  item(id: string, partitionKey: string): {
    read<T>(): Promise<{ resource: T | undefined }>
  }
  items: {
    create<T>(doc: T): Promise<void>
  }
}

export function makeContainer(log: string[]): Container {
  return {
    item(id, partitionKey) {
      return {
        async read<T>() {
          log.push(`read:${id}:${partitionKey}`)
          return { resource: undefined as T | undefined }
        },
      }
    },
    items: {
      async create(doc) {
        log.push(`create:${JSON.stringify(doc)}`)
      },
    },
  }
}

export function getContainerV2(_name: string): Container {
  throw new Error('The reproduction always supplies an explicit fake container')
}
