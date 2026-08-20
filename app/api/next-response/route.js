import { NextResponse } from 'next/server';
export async function GET() {
  const v = `${Date.now()}`;
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', v, { path: '/', domain: '.example1.com', secure: true, httpOnly: true, sameSite: 'none' });
  res.cookies.set('session', v, { path: '/', domain: '.example2.com', secure: true, httpOnly: true, sameSite: 'none' });
  return res;
}
