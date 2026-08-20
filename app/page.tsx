import { headers } from 'next/headers'

function baseUrl() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
}

async function run(label: string, getInit: () => Promise<RequestInit>) {
  try {
    const res = await fetch(`${baseUrl()}/api/test`, await getInit())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return `${label}: OK -> ${JSON.stringify(await res.json())}`
  } catch (e: any) {
    return `${label}: ERROR -> ${e?.message}\n${e?.stack}`
  }
}

export default async function Home() {
  const d = await run('D no init', async () => ({}))
  const e = await run('E static header object', async () => ({
    headers: { 'x-test': '1' },
  }))
  const a = await run('A direct headers()', async () => ({
    headers: await headers(),
  }))
  const b = await run('B new Headers(headers())', async () => ({
    headers: new Headers(await headers()),
  }))
  const c = await run('C plain object copy of headers()', async () => ({
    headers: Object.fromEntries((await headers()).entries()),
  }))
  const f = await run('F copy minus x-vercel-*', async () => {
    const h = Object.fromEntries((await headers()).entries())
    for (const k of Object.keys(h)) if (k.startsWith('x-vercel')) delete h[k]
    return { headers: h }
  })
  const g = await run('G only x-vercel-id', async () => ({
    headers: { 'x-vercel-id': (await headers()).get('x-vercel-id') || '' },
  }))
  const all = Object.fromEntries((await headers()).entries())
  const vercelKeys = Object.keys(all).filter((k) => k.startsWith('x-vercel'))
  const combos: Record<string, string[]> = {
    'I sc-host+sc-headers': ['x-vercel-sc-host', 'x-vercel-sc-headers'],
    'J all sc-*': ['x-vercel-sc-host', 'x-vercel-sc-headers', 'x-vercel-sc-basepath'],
    'K proxy-signature pair': ['x-vercel-proxy-signature', 'x-vercel-proxy-signature-ts'],
  }
  const comboResults: string[] = []
  for (const [label, keys] of Object.entries(combos)) {
    comboResults.push(
      await run(label, async () => ({
        headers: Object.fromEntries(keys.map((k) => [k, all[k] ?? ''])),
      }))
    )
  }
  const perKey: string[] = []
  for (const k of vercelKeys) {
    perKey.push(await run(`H only ${k}`, async () => ({ headers: { [k]: all[k] } })))
  }
  return (
    <main>
      <pre>{`vercel headers present: ${vercelKeys.join(', ')}`}</pre>
      {comboResults.map((t, i) => (
        <pre key={'c' + i}>{t}</pre>
      ))}
      {perKey.map((t, i) => (
        <pre key={'h' + i}>{t}</pre>
      ))}
      <h1>next#63453</h1>
      {[d, e, a, b, c, f, g].map((t, i) => (
        <pre key={i}>{t}</pre>
      ))}
    </main>
  )
}
