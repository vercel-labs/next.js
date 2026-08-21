import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Router Cache hit issue with defuault prefetch',
  description: 'Router Cache hit issue with defuault prefetch test app',
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
