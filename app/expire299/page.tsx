import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife({ expire: 299 })
  return new Date().toISOString()
}

export default async function Page() {
  return <p>expire299: {await getData()}</p>
}
