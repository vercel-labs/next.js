import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/middleware/axios')) {
    await axios.get('http://localhost:4000/', {
      signal: AbortSignal.timeout(1000),
      adapter: 'fetch',
    });
  }

  if (req.nextUrl.pathname.startsWith('/middleware/fetch')) {
    await fetch('http://localhost:4000/', {
      signal: AbortSignal.timeout(1000),
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/middleware/axios', '/middleware/fetch'],
};
