export function generateStaticParams() {
  return [{ pageSlug: ['page-1'] }, { pageSlug: ['page-2'] }]
}
export default async function Page({ params }: { params: Promise<{ pageSlug: string[] }> }) {
  const { pageSlug } = await params
  return <h1>PAGE route: {pageSlug.join('/')}</h1>
}
