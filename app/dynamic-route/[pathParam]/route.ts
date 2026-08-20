export async function GET(_req: Request, props: { params: Promise<{ pathParam: string }> }) {
  const params = await props.params
  return Response.json({ method: 'GET', params })
}
