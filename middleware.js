import { NextResponse } from 'next/server'

export async function middleware(req) {
  const target = `${req.nextUrl.origin}/api/hello`
  try {
    const res = await fetch(target)
    return NextResponse.json({
      middlewareFetch: 'ok',
      target,
      status: res.status,
      body: await res.text(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        middlewareFetch: 'failed',
        target,
        name: err?.name,
        message: err?.message,
        code: err?.code ?? err?.cause?.code,
        cause: err?.cause
          ? { message: err.cause.message, code: err.cause.code, library: err.cause.library, reason: err.cause.reason }
          : null,
      },
      { status: 500 }
    )
  }
}

export const config = { matcher: '/middleware-test' }
