export function generateStaticParams() {
  return [{ slug: ['alpha'] }]
}

// The catch-all route: `/[locale]/[...slug]/page`, whose page segment path is
// `/$d$locale/$c$slug/__PAGE__` — a different shape than the home route's.
export default async function CatchAllPage({
  params,
}: PageProps<'/[locale]/[...slug]'>) {
  const { locale, slug } = await params
  return (
    <main>
      <p id="catch-all">{`catch-all:${locale}:${slug.join('/')}:end`}</p>
    </main>
  )
}
