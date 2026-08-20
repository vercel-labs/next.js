import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Grouped named exports (eslint-plugin-import `import/group-exports` style).
// The `config.matcher` below is IGNORED by Next.js, so middleware runs on
// /_next/static/* and *.svg too.
const middleware = async (req: NextRequest) => {
  console.log('MIDDLEWARE:', req.url)
  return NextResponse.next()
}

const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.ico|.*\\.svg).*)'],
}

export { middleware, config }

// Working variant (config IS applied) -- swap the block above for this one:
// export const middleware = async (req: NextRequest) => { ... }
// export const config = { matcher: [...] }
