import { Suspense } from 'react'

export const ServerComponent = ({ id, nonce }: { id: string; nonce: string }) => {
  return (
    <div id={id}>
      <Suspense key={JSON.stringify(nonce)} fallback={<>loading...</>}>
        <ServerComponentAsync nonce={nonce} />
      </Suspense>
    </div>
  )
}

const ServerComponentAsync = async ({ nonce }: { nonce: string }) => {
  const port = process.env.PORT ?? '3000'
  const res = await fetch(`http://localhost:${port}/api?key=${nonce}`, {
    cache: 'no-store',
  })
  const { key } = (await res.json()) as { key: string }
  return <div>key: {key}</div>
}
