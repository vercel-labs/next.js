import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turbopack Monorepo Repro',
  description: 'Minimal reproduction of Turbopack path doubling bug',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
