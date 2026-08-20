export default function Other({ now }) {
  return (
    <main>
      <h1 id="other">other</h1>
      <p>{now}</p>
    </main>
  )
}

export async function getServerSideProps() {
  return { props: { now: new Date().toISOString() } }
}
