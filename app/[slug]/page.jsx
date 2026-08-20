import { Suspense } from 'react'

export const dynamic = 'force-static'
export const dynamicParams = true
export const revalidate = 20

export default async function SuspenseTest(props) {
  const slug = (await props.params).slug
  return (
    <div>
      <h1 id="static">This is a static content</h1>
      <Suspense fallback={<p id="fallback">Loading...</p>}>
        <LongRunning slug={slug} />
      </Suspense>
    </div>
  )
}

async function LongRunning(props) {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return <span id="done">Success! ({props.slug})</span>
}
