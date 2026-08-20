import { NextResponse } from 'next/server';

// Reflects user-controlled query params into response headers / redirect Location
export async function GET(request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get('h') ?? 'safe-value';
  try {
    const res = NextResponse.json({ ok: true, reflected: raw });
    res.headers.set('X-Reflected', raw);
    return res;
  } catch (err) {
    return new NextResponse('header set threw: ' + err.name + ': ' + err.message, { status: 500 });
  }
}
