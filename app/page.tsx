async function CacheComponent() {
  'use cache'
  return <div id="cached">VALUE_1</div>
}

export default function Home() {
  return (
    <main>
      <h1>use cache HMR</h1>
      <CacheComponent />
    </main>
  )
}
