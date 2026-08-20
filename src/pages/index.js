import useSWR from 'swr'

export default function Home() {
  const { data } = useSWR('hello-0', async () => (
    (await fetch('/api/hello')).json()
  ), { suspense: true })

  return (
    <main>
      Page /: Hello {data.name}!
    </main>
  )
}
