export async function POST() {
  return Response.json(
    { error: { message: 'reconcile failed', code: -32603 } },
    { status: 200 }
  )
}
