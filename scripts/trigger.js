// Reproduces vercel/next.js#77568:
// 1. Fetch "/" to read the server action id embedded in the page.
// 2. POST that action id to a path the action is NOT associated with ("/foo").
// The middleware rewrite makes Next forward the action request to the literal
// "/[locale]" worker pathname, which forwards again -> infinite loop.
const base = process.env.BASE_URL || 'http://localhost:3000'

async function main() {
  const html = await (await fetch(base + '/')).text()
  const actionId = (html.match(/[0-9a-f]{40,42}/) || [])[0]
  if (!actionId) throw new Error('could not find action id in page HTML')
  console.log('action id:', actionId)

  const ac = new AbortController()
  setTimeout(() => ac.abort(), 15000)
  try {
    const res = await fetch(base + '/foo', {
      method: 'POST',
      headers: {
        'next-action': actionId,
        'content-type': 'text/plain;charset=UTF-8',
      },
      body: '[]',
      signal: ac.signal,
    })
    console.log('status:', res.status)
  } catch (err) {
    console.log('request aborted after 15s (server is looping):', err.name)
  }
  console.log('Now watch the server output: it keeps logging')
  console.log('  [middleware] POST /[locale] ... x-action-forwarded=1')
  console.log('forever, even after the client disconnected, until the process OOMs.')
}

main()
