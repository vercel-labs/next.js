import { Refresh } from '@/components/refresh'
import { ServerComponent } from '@/components/server-component'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ key1?: string; key2?: string }>
}) {
  const { key1 = '1', key2 = '2' } = await searchParams

  return (
    <div>
      <div id="keys">
        <div>key 1: {key1}</div>
        <div>key 2: {key2}</div>
      </div>
      <Refresh key1={key1} key2={key2} />
      <ServerComponent id="sc1" nonce={key1} />
      <ServerComponent id="sc2" nonce={key2} />
    </div>
  )
}
