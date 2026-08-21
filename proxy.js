import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function proxy(request) {
    const xabalas = await headers();
    const session = null

    console.log('request', request.nextUrl.pathname)

    if(!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!session?.activeOrganizationId && !(request.nextUrl.pathname.startsWith('/organizations')) && !(request.nextUrl.pathname.startsWith('/organizations/create'))) {
        return NextResponse.redirect(new URL("/organizations", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', 
        '/((?!api|_next/static|_next/image|login|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
