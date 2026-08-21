import type { Metadata } from 'next';

// Import the bloat to increase bundle size
import '../lib/bloat';

export const metadata: Metadata = {
  title: 'Next.js Hydration Bug Reproduction',
  description: 'Testing form field replacement during hydration',
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
