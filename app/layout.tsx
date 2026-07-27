import type {ReactNode} from 'react';

export const metadata = {
  title: 'Hydration livelock reproduction',
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
