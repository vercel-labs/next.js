import { NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

export async function middleware() {
  const tracer = trace.getTracer('middleware');
  return tracer.startActiveSpan('middleware-custom-span', (span) => {
    span.end();
    return NextResponse.next();
  });
}

export const config = { matcher: ['/'] };
