export default async function Page({ params }) {
  const { slug } = await params
  if (slug !== 'prebuilt') {
    throw new Error('boom from server component (nogsp)')
  }
  return <h1>ok: {slug}</h1>
}
