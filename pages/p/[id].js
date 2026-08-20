export function getStaticPaths() {
  return { paths: Array.from({ length: 20 }, (_, i) => ({ params: { id: String(i) } })), fallback: false }
}
export function getStaticProps({ params }) { return { props: { id: params.id } } }
export default function P({ id }) {
  return (
    <main>
      <h1 className="a">page {id}</h1>
      {Array.from({ length: 200 }, (_, i) => <div key={i} className={`sel-${i}`}>row {i}</div>)}
    </main>
  )
}
