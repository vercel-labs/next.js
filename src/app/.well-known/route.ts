import { NextResponse } from "next/server";
// The same "~/*" alias that works in src/app/page.tsx is reported as
// TS2307 "Cannot find module '~/constants'" here, because this file lives in a
// dot-prefixed directory that tsconfig's "**/*.ts" glob never matches.
import { IS_DEVELOPMENT } from "~/constants";

export function GET() {
  return NextResponse.json({ isDevelopment: IS_DEVELOPMENT });
}
