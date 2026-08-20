import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


const isProtectedRoute = createRouteMatcher([
  '/',
  '/dashboard(.*)',
]);

export default clerkMiddleware((auth, request: any) => {
  if (!auth().userId && isProtectedRoute(request)) {
    return auth().redirectToSignIn();
  }
  if(auth().userId && request.nextUrl.pathname === "/"){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}