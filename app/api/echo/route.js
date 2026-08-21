export async function POST(request) {
  const text = await request.text()
  let parsed = 'ok'
  try { JSON.parse(text) } catch (e) { parsed = 'PARSE_ERROR: ' + e.message.slice(0, 60) }
  return Response.json({
    contentLengthHeader: request.headers.get('content-length'),
    receivedBytes: Buffer.byteLength(text),
    parsed,
  })
}
