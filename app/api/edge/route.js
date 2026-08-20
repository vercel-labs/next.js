export const runtime = "edge"

export async function POST() {
  const cause = new Error('cause')
  cause.body = 'cause body'
  console.error(new Error('edge runtime error', { cause }))
  return new Response('logged')
}
