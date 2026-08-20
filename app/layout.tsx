import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <p id="shell">static shell</p>
        <Suspense fallback={<p id="fallback">loading…</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
