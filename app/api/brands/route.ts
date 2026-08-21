let requestId = 0;

export async function GET(req: Request) {
  const url = new URL(req.url);
  requestId += 1;
  console.log('[api] GET /api/brands', url.search, 'requestId=', requestId);
  return Response.json({
    page: Number(url.searchParams.get('page') ?? 0),
    search: url.searchParams.get('search') ?? '',
    requestId,
  });
}
