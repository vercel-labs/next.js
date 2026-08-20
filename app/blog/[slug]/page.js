export async function generateStaticParams() {
  console.log('[generateStaticParams] pid', process.pid, 'globalThis.MY_SINGLETON =', globalThis.MY_SINGLETON)
  return [{ slug: 'a' }, { slug: 'b' }]
}

export default async function Page({ params }) {
  const { slug } = await params
  console.log('[page component] pid', process.pid, 'globalThis.MY_SINGLETON =', globalThis.MY_SINGLETON)
  return (
    <pre>
      {JSON.stringify({ slug, singletonInComponent: globalThis.MY_SINGLETON ?? null }, null, 2)}
    </pre>
  )
}
