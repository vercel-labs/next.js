import { NextResponse } from 'next/server'
import { z } from 'zod'
import * as jose from 'jose'
// Simulates libraries that ship a WASM asset into the Edge bundle (Prisma, Arcjet, ...)
import bigWasm from './big.wasm?module'

const schema = z.object({ a: z.string() })
let instance

export function middleware(request) {
  instance ||= new WebAssembly.Instance(bigWasm)
  const res = NextResponse.next()
  res.headers.set(
    'x-bits',
    [
      instance.exports.memory.buffer.byteLength,
      Object.keys(jose).length,
      schema.safeParse({ a: request.nextUrl.pathname }).success,
    ].join(',')
  )
  return res
}

export const config = { matcher: '/:path*' }
