import { cacheLife } from 'next/cache'

async function getSection() {
  'use cache'
  cacheLife('minutes')
  if (process.env.FAIL_BACKEND === '1') {
    throw new Error('backend read failed')
  }
  return 'ok'
}

export default async function Page() {
  let data: string
  try {
    data = await getSection()
  } catch {
    // A "reporting" call in the catch path performs sync IO (Math.random()),
    // a disallowed-dynamic violation under cacheComponents.
    data = 'error-' + Math.random()
  }
  return <p>{data}</p>
}
