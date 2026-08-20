export default async function handler(req, res) {
  console.log('[api] res.revalidate("/") start')
  await res.revalidate('/')
  console.log('[api] res.revalidate("/") done')
  return res.json({ revalidated: true })
}
