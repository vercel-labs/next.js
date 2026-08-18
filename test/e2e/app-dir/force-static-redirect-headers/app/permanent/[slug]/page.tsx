import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-static'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/target/${slug}`)
}
