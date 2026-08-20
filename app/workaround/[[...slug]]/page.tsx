import { allPages } from '../../all-pages'
import ClientResolved from '../../ClientResolved'

export async function generateStaticParams() {
  return allPages.map((p) => ({ slug: [p.slug] }))
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug || ['about']
  const page = allPages.find((p) => p.slug === slug.join('/'))
  if (!page) return <div>Page not found</div>
  return (
    <div>
      <h1>workaround {page.title}</h1>
      {page.components.map((c, i) => (
        <ClientResolved key={i} name={c.name} />
      ))}
    </div>
  )
}
