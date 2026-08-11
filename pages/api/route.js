// Stub so the docs snippet below can run unchanged.
// ?session=none -> no session, ?session=user -> authenticated non-admin, ?session=admin -> admin
async function getSession(req) {
  const kind = new URL(req.url, 'http://localhost').searchParams.get('session')
  if (kind === 'admin') return { user: { role: 'admin' } }
  if (kind === 'user') return { user: { role: 'user' } }
  return null
}

// --- verbatim from https://nextjs.org/docs/pages/guides/authentication#creating-a-data-access-layer-dal-1
export default async function handler(req, res) {
  const session = await getSession(req)

  // Check if the user is authenticated
  if (!session) {
    res.status(401).json({
      error: 'User is not authenticated',
    })
    return
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== 'admin') {
    res.status(401).json({
      error: 'Unauthorized access: User does not have admin privileges.',
    })
    return
  }

  // Proceed with the route for authorized users
  // ... implementation of the API Route
  res.status(200).json({ ok: true })
}
