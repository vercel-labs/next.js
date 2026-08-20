export async function GET() {
  const value = `session=${Date.now()}`;
  const headers = new Headers();
  headers.append('Set-Cookie', `${value}; Path=/; Domain=.example1.com; Secure; HttpOnly; SameSite=none`);
  headers.append('Set-Cookie', `${value}; Path=/; Domain=.example2.com; Secure; HttpOnly; SameSite=none`);
  return new Response(JSON.stringify({ ok: true }), { headers });
}
