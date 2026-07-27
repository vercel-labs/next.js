import { NextResponse } from 'next/server.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    next: process.env.npm_package_dependencies_next,
    node: process.version,
    undici: process.versions.undici,
  })
}

export async function POST(request) {
  const started = Date.now()
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    return NextResponse.json({
      ok: true,
      size: file?.size ?? null,
      elapsedMs: Date.now() - started,
    })
  } catch (error) {
    console.error('FORMDATA_ERROR', error)
    return NextResponse.json({
      ok: false,
      name: error?.name,
      message: error?.message,
      cause: error?.cause?.message ?? null,
      elapsedMs: Date.now() - started,
    }, { status: 500 })
  }
}
