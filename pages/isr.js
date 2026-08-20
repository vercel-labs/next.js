export function getStaticProps() { return { props: { t: Date.now() }, revalidate: 1 } }
export default function Isr({ t }) {
  return (
    <main>
      <h1 className="b">isr {t}</h1>
      {Array.from({ length: 200 }, (_, i) => <div key={i} className={`sel-${i}`}>row {i}</div>)}
    </main>
  )
}
