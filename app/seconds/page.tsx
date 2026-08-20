import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('seconds')
  return new Date().toISOString()
}

export default async function Page() {
  return <p>seconds: {await getData()}</p>
}
