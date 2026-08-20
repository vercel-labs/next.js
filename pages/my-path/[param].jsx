import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  return (
    <pre id="out">{JSON.stringify(router.query, null, 2)}</pre>
  )
}

export function getServerSideProps(ctx) {
  console.log('[gSSP] params =', JSON.stringify(ctx.params), 'query =', JSON.stringify(ctx.query))
  return { props: {} }
}
