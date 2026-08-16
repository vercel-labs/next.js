export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

function makeRows(slug) {
  const rows = []
  for (let i = 0; i < 500; i++) {
    rows.push({
      id: `${slug}-${i}`,
      title: `Product ${slug} #${i} ${'x'.repeat(40)}`,
      desc: `Description for ${slug} item ${i}. ${'lorem ipsum dolor sit amet '.repeat(3)}`,
    })
  }
  return rows
}

export default async function Page({ params }) {
  const { slug } = await params
  const rows = makeRows(slug)
  return (
    <main>
      <h1>{slug}</h1>
      <ul>
        {rows.map((r) => (
          <li key={r.id} data-title={r.title}>{r.desc}</li>
        ))}
      </ul>
    </main>
  )
}
