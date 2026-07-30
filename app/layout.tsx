import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { getSharedSettings } from "./lib/cache";

export async function generateMetadata() {
  const settings = await getSharedSettings();
  return { title: settings.title };
}

/**
 * Session data in the layout. This is what makes every route a *runtime*
 * prerender (session shell) rather than a purely build-time static page --
 * the same situation as any app that reads an auth cookie in its root layout.
 */
async function SessionBadge() {
  const theme = (await cookies()).get("theme")?.value ?? "light";
  return <span data-testid="theme">{theme}</span>;
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Read the shared cache entry in the layout shell (not behind Suspense),
  // exactly like an app-wide settings read.
  const settings = await getSharedSettings();

  return (
    <html lang="en">
      <body>
        <header data-testid="layout-settings">
          {settings.title}{" "}
          <Suspense fallback={<span>…</span>}>
            <SessionBadge />
          </Suspense>
        </header>
        <nav>
          <Link href="/">home</Link> <Link href="/a">a</Link>{" "}
          <Link href="/b">b</Link> <Link href="/slow">slow</Link>{" "}
          <Link href="/late-reader">late-reader</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
