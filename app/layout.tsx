import { Suspense } from "react";
import { NonceScript } from "./nonce-script";

// VARIANT=suspense -> wrap the headers() access in <Suspense> (builds, but the
// inline <head> script is streamed in late instead of blocking).
// default        -> read headers() at the top of the root layout (build fails).
const SUSPENSE = process.env.VARIANT === "suspense";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {SUSPENSE ? (
          <Suspense>
            <NonceScript />
          </Suspense>
        ) : (
          <NonceScript />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
