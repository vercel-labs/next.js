import { NextResponse } from 'next/server';
import { AggregationTemporality } from '@opentelemetry/sdk-metrics';

export function middleware(request) {
  console.log('AggregationTemporality.DELTA', AggregationTemporality.DELTA);
  return NextResponse.next();
}

export const config = { matcher: '/' };
