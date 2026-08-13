import { connection } from 'next/server'

// The route has no `generateStaticParams`, and it blocks on `connection()`
// outside of any Suspense boundary, so the build-time shell is empty.
// `instant = false` is the only sanctioned way to allow that.
export const instant = false

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  await connection()
  const { locale, slug } = await params

  return (
    <p id="product">
      {locale}/{slug}
    </p>
  )
}
