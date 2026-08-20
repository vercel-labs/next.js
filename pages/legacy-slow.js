export async function getServerSideProps() {
  await new Promise((r) => setTimeout(r, 2000))
  return { props: {} }
}
export default function LegacySlow() {
  return <h1 id="slow">/legacy-slow rendered (getServerSideProps waited 2000ms)</h1>
}
