export interface Container {
  item(id: string, partitionKey: string): {
    read<T>(): Promise<{ resource?: T | null }>
  }
  items: {
    create<T>(document: T): Promise<{ resource: T }>
  }
}

export interface Doc {
  id: string
  userId: string
  mode: string
  schemaVersion?: number
  branch: 'created-by-null-guard' | 'migrated-existing-document'
}
