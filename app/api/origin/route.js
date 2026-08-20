export async function GET() {
  return new Response('origin response', {
    headers: {
      'x-modify-me': 'original-value',
      'x-remove-me': 'should-be-removed',
      'content-type': 'text/plain',
    },
  })
}
