import { cacheLife } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: 'a' }]
}

async function getSection(id: string) {
  'use cache'
  cacheLife('minutes')
  if (process.env.FAIL_BACKEND === '1') {
    throw new Error('backend read failed')
  }
  return 'ok:' + id
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let data: string
  try {
    data = await getSection(id)
  } catch {
    data = 'error-' + Math.random()
  }
  return <p>{data}</p>
}
