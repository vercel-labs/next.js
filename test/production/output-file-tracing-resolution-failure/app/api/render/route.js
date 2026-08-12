export const dynamic = 'force-dynamic'

export async function GET() {
  // `external-with-broken-dep` is a server external package, so it is
  // `require`d at runtime and only reaches the output file tracing, never the
  // bundler. Its own `require('broken-entry-pkg')` cannot be resolved because
  // the file that the `exports` map points at does not exist.
  const mod = await import('external-with-broken-dep')
  return Response.json({ value: mod.default.load() })
}
