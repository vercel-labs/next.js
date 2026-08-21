// Middleware file that needs NO content changes (as in `create-next-app --example auth`):
// the export specifier's local name is `auth`, not `middleware`, so the transform
// reports no changes and therefore never renames the file.
export { auth as middleware } from './auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
