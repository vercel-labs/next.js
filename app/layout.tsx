import { Suspense } from "react";

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<p>loading page…</p>}>{children}</Suspense>
        <Suspense fallback={<p>loading modal…</p>}>{modal}</Suspense>
      </body>
    </html>
  );
}
