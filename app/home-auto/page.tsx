import { draftMode } from 'next/headers'

// no `dynamic` export -> auto
export default async function HomeAuto({ searchParams }: any) {
  const sp = await searchParams
  const dm = await draftMode()
  console.log('[home-auto] draftMode.isEnabled =', dm.isEnabled, '| searchParams =', JSON.stringify(sp))
  return <pre>draft={String(dm.isEnabled)} searchParams={JSON.stringify(sp)}</pre>
}
