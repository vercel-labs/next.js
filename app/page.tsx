export const dynamic = 'force-dynamic'

export default function Home() {
  return <h1 id="home">Home {new Date().toISOString()}</h1>
}
