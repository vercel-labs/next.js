import { cacheLife, cacheTag } from 'next/cache'

let fillCounter = 0

export async function getProduct(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  fillCounter += 1

  // The pid distinguishes a build-worker fill from a runtime fill.
  return {
    title: `PRODUCT ${slug.toUpperCase()}`,
    fill: `${process.pid}-${fillCounter}`,
  }
}
