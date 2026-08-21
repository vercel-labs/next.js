import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get('host');
  console.log('layout render', host);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
