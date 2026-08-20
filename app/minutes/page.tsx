import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('minutes')
  return new Date().toISOString()
}

export default async function Page() {
  return <p>minutes: {await getData()}</p>
}
