import { cacheLife, cacheTag } from 'next/cache'

const items: string[] = ['a', 'b', 'c']

export async function getItems(): Promise<string[]> {
  'use cache'
  cacheTag('items')
  cacheLife('hours')

  return [...items]
}

export async function addItem(value: string): Promise<void> {
  items.push(value)
}
