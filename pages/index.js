export default function Home({ test }) {
  return <pre id="out">{JSON.stringify(test, null, 2)}</pre>
}
export function getServerSideProps() {
  return { props: { test: { TEST: process.env.TEST ?? null, NEXT_PUBLIC_TEST: process.env.NEXT_PUBLIC_TEST ?? null } } }
}
