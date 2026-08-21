import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading data in 8 seconds...</div>}>
        <Slow />
      </Suspense>
    </div>
  )
}

async function Slow() {
  await new Promise((r) => setTimeout(r, 8000))
  return <div id="data">Data Fetched</div>
}
