import { headers } from 'next/headers';

export default async function RootLayout({ children }) {
  if (process.env.NEXT_PUBLIC_DYNAMIC === '1') {
    const h = await headers();
    const nonce = h.get('x-nonce') ?? '';
    return (
      <html lang="en">
        <body>
          {children}
          <script nonce={nonce} />
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
