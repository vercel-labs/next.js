import { unstable_cache } from 'next/cache'

const REVALIDATE = 5

const getData = unstable_cache(
  async () => {
    const ts = Date.now()
    console.log('[unstable_cache cb executed] fresh ts =', ts)
    return { ts }
  },
  ['getData'],
  { revalidate: REVALIDATE, tags: ['getData'] }
)

export default async function Page() {
  const { ts } = await getData()
  const now = Date.now()
  console.log('[render] rendered with ts =', ts, 'lag(ms) =', now - ts)
  return (
    <div>
      <p id="ts">{ts}</p>
      <p id="lag">{now - ts}</p>
    </div>
  )
}
