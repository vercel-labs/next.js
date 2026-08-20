const pages = [{ slug: 'page-a', title: 'Page A' }]

export default async function Page(props: any) {
  const params = await props.params
  const page = pages.find((p) => p.slug === params.slug)
  return <h1 id="page">{page ? page.title : 'RENDERED UNKNOWN SLUG: ' + params.slug}</h1>
}

export async function generateStaticParams() {
  return pages.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false
