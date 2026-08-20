import useSWR from 'swr'

export default function Home() {
  const { data } = useSWR('hello-2', async () => (
    (await fetch('/api/hello')).json()
  ), { suspense: true })

  return (
    <main>
      Page /test-2: Hello {data.name}!
    </main>
  )
}
