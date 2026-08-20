import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname, basePath, locale, href } = req.nextUrl
  console.log(
    `[middleware] url=${req.url} => pathname=${JSON.stringify(
      pathname
    )} basePath=${JSON.stringify(basePath)} locale=${JSON.stringify(
      locale
    )} href=${href}`
  )
  return NextResponse.next()
}
