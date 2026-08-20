export async function POST(req) {
  let parsed = null, err = null;
  try { parsed = await req.json(); } catch (e) { err = String(e && e.message); }
  return Response.json({ contentType: req.headers.get('content-type'), parsed, err });
}
