import { allPages } from '../all-pages'
import resolveComponent from '../resolveComponent'

export async function generateStaticParams() {
  return allPages.map((p) => ({ slug: [p.slug] }))
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug || ['about']
  const page = allPages.find((p) => p.slug === slug.join('/'))
  if (!page) return <div>Page not found</div>
  return (
    <div>
      <h1>{page.title}</h1>
      {page.components.map((c, i) => {
        const C = resolveComponent(c.name)
        return C ? <C key={i} /> : null
      })}
    </div>
  )
}
