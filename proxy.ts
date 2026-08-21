import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Next 16: `proxy.ts` always runs on the Node.js runtime.
// Next 15: same bug with `middleware.ts` + `export const runtime = 'nodejs'`
// (it works when the runtime export is removed, i.e. on the edge runtime).
export default async function proxy(request: NextRequest) {
  const response = NextResponse.next()

  console.log('[proxy] NEXT_RUNTIME =', process.env.NEXT_RUNTIME)
  console.log(
    '[proxy] __NEXT_PREVIEW_MODE_ID =',
    JSON.stringify(process.env.__NEXT_PREVIEW_MODE_ID)
  )

  if (request.nextUrl.searchParams.get('draft') === 'true') {
    // Throws: Invariant: previewProps missing previewModeId this should never happen
    ;(await draftMode()).enable()
  }

  response.headers.set(
    'x-draft-mode',
    (await draftMode()).isEnabled ? 'enabled' : 'disabled'
  )

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
