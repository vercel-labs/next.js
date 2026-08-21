import type { Metadata } from 'next';
export const metadata: Metadata = { robots: 'index, follow' };
export default function RootLayout({ children }: any) {
  return (<html lang="en"><body>{children}</body></html>);
}
