import { draftMode } from 'next/headers'

export const dynamic = 'force-static'

export default async function Home({ searchParams }: any) {
  const sp = await searchParams
  const dm = await draftMode()
  console.log('[home] draftMode.isEnabled =', dm.isEnabled, '| searchParams =', JSON.stringify(sp))
  return <pre>draft={String(dm.isEnabled)} searchParams={JSON.stringify(sp)}</pre>
}
