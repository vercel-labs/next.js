import { NextRequest, NextResponse } from "next/server";

// Simulates server-side rewrite behavior (e.g. normalisation, A/B testing,
// geo-routing) that causes the rendered search params to differ from the
// navigation URL. This is the trigger for the scroll:false bug in
// Next.js 16.2.x:
//
// 1. Hover "/" → prefetch seeded with __PAGE__ (no search params)
// 2. Navigate to /?color=red →
//    deprecated_requestOptimisticRouteCacheEntry builds optimistic tree with
//    __PAGE__?{"color":"red"} (correctly predicts the search params)
// 3. Middleware rewrites to /?color=red&_rsc_v=1
// 4. Server renders with renderedSearch="?_rsc_v=1&color=red" →
//    returns __PAGE__?{"_rsc_v":"1","color":"red"} in the route tree
// 5. matchSegment(__PAGE__?{"_rsc_v":"1","color":"red"},
//               __PAGE__?{"color":"red"}) = false → task stays pending
// 6. exitStatus=1 → dispatchRetryDueToTreeMismatch with ScrollBehavior.Default
// 7. Retry creates new page segment → scrollRef set → Default scrolls
// 8. scroll:false from router.replace() is ignored
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (
    url.pathname === "/" &&
    url.searchParams.has("color") &&
    !url.searchParams.has("_rsc_v")
  ) {
    const rewritten = url.clone();
    rewritten.searchParams.set("_rsc_v", "1");
    return NextResponse.rewrite(rewritten);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
