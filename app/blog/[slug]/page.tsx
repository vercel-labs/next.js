export const dynamic = 'force-static'
export const dynamicParams = true

export function generateStaticParams() {
  return [{ slug: 'prebuilt' }]
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <h1 id="t">blog {slug}: {Date.now()}</h1>
}
