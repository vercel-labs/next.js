export function getServerSideProps() { return { props: { t: Date.now() } } }
export default function Ssr({ t }) {
  return (
    <main>
      <h1 className="a">ssr {t}</h1>
      {Array.from({ length: 200 }, (_, i) => <div key={i} className={`sel-${i}`}>row {i}</div>)}
    </main>
  )
}
