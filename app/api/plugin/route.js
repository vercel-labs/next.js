import { loadPlugin } from 'home-plugin-loader'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const name = new URL(req.url).searchParams.get('name') || 'noop'
  try {
    return Response.json({ ok: true, plugin: typeof loadPlugin(name) })
  } catch (e) {
    return Response.json({ ok: false, error: String(e) })
  }
}
