const mode = process.argv[2] ?? 'node'
const boundary = '--------------------------nextjs73220'
const prefix = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="zeros.bin"\r\nContent-Type: application/octet-stream\r\n\r\n`)
const suffix = Buffer.from(`\r\n--${boundary}--\r\n`)
const firstFailFileBytes = 2 ** 31 - prefix.length - 4
const fileBytes = Number(process.argv[3] ?? firstFailFileBytes)
const contentLength = prefix.length + fileBytes + suffix.length

// allocUnsafe leaves the large file area backed by untouched zero pages. This keeps
// the probe below 4 GiB RSS while preserving the parser's >2 GiB byte offsets.
const input = Buffer.allocUnsafe(contentLength)
prefix.copy(input, 0)
suffix.copy(input, prefix.length + fileBytes)
const body = new ReadableStream({
  start(controller) {
    controller.enqueue(input)
    controller.close()
  },
})
const init = {
  method: 'POST',
  headers: {
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': String(contentLength),
  },
  body,
  duplex: 'half',
}

console.log(JSON.stringify({ mode, fileBytes, contentLength, closingBoundaryOffset: prefix.length + fileBytes + 4 }))
if (mode === 'node') {
  const request = new Request('http://localhost/', init)
  try {
    const data = await request.formData()
    console.log(JSON.stringify({ status: 200, size: data.get('file')?.size ?? null }))
  } catch (error) {
    console.log(JSON.stringify({ status: 500, name: error?.name, message: error?.message, cause: error?.cause?.message ?? null }))
    process.exitCode = 1
  }
} else if (mode === 'next') {
  const [{ NextRequest }, { POST }] = await Promise.all([
    import('next/server.js'),
    import('../app/api/upload/route.js'),
  ])
  const response = await POST(new NextRequest('http://localhost/api/upload', init))
  console.log(`HTTP ${response.status}`)
  console.log(await response.text())
  if (!response.ok) process.exitCode = 1
} else {
  throw new Error('mode must be "node" or "next"')
}
