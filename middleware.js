import { NextResponse } from 'next/server';

// Does not touch the request body at all.
export function middleware() {
  return NextResponse.next();
}
