export function GET(request) {
  return Response.json({ url: request.url })
}
