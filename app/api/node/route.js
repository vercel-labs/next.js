export async function POST() {
  const cause = new Error('cause')
  cause.body = 'cause body'
  console.error(new Error('node runtime error', { cause }))
  return new Response('logged')
}
