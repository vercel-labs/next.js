export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id') ?? '0';
  const rows = [];
  for (let i = 0; i < 800; i++) {
    rows.push({ id: `${id}-${i}`, sku: `SKU-${id}-${i}`, description: `d${i}`.padEnd(400, 'x'), price: i * 1.5 });
  }
  return Response.json({ id, rows });
}
