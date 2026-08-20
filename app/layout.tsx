import { Suspense } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>global nav</nav>
        {/* Suspense boundary in the root layout, as in the issue report */}
        <Suspense fallback={<p>loading...</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
