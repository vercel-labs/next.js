export const dynamic = 'force-dynamic';
export async function GET() {
  await new Promise((r) => setTimeout(r, 5000));
  return Response.json({ message: 'slow payload' });
}
