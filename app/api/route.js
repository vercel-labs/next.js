export const GET = () => Response.json({ message: 'Hello, world!' })
export const POST = async (req) => {
  const body = await req.json()
  return Response.json({ message: 'Hello, world!', body })
}
