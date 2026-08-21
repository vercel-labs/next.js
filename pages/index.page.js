export function getServerSideProps() {
  console.log('instrumentation registered:', globalThis._instrumentation_registered)
  return { props: { registered: !!globalThis._instrumentation_registered } }
}
export default function Home({ registered }) {
  return <p>instrumentation registered: {String(registered)}</p>
}
