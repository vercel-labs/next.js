import type { PropsWithChildren } from 'react';
import { Providers } from './providers';

export const metadata = { title: 'repro 97354' };

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
