import useSWR from 'swr'

export default function Home() {
  const { data } = useSWR('hello-1', async () => (
    (await fetch('/api/hello')).json()
  ), { suspense: true })

  return (
    <main>
      Page /test-1: Hello {data.name}!
    </main>
  )
}
