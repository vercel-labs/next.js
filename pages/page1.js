import { useRouter } from 'next/router'

let gsspCount = 0

export default function Page1({ stamp }) {
  const router = useRouter()
  return (
    <div>
      <h1 id="page">page1</h1>
      <p id="stamp">{stamp}</p>
      <p id="query">{JSON.stringify(router.query)}</p>
      <button id="shallow" onClick={() => router.replace('/page1?count=1', undefined, { shallow: true })}>
        shallow replace
      </button>
      <button id="next" onClick={() => router.push('/page' + (1 === 1 ? 2 : 1))}>next page</button>
    </div>
  )
}

export async function getServerSideProps() {
  gsspCount++
  const stamp = 'page1-gssp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
  console.log('[GSSP] /page1 ->', stamp)
  return { props: { stamp } }
}
