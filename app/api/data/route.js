export const dynamic = 'force-dynamic' // opt route out of the full route cache

export async function GET() {
  const started = Date.now()
  const res = await fetch('http://127.0.0.1:4000/', {
    next: { revalidate: 5 },
  })
  const data = await res.json()
  return Response.json({ ...data, fetchMs: Date.now() - started })
}
