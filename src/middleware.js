import { NextResponse } from 'next/server'

export function middleware(request) {
  console.log('middleware request.url:', request.url)
  return NextResponse.next()
}
