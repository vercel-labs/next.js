export async function generateMetadata({ params }) {
  const { slug } = await params
  console.log('[REPRO] generateMetadata rendered for slug:', slug)
  return { title: 'catch-all' }
}

export default async function Page({ params }) {
  const { slug } = await params
  console.log('[REPRO] page component rendered for slug:', slug)
  return <div>Page: {JSON.stringify(slug ?? null)}</div>
}
