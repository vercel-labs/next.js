import { PropsWithChildren } from 'react';
import { Viewport } from 'next';


const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="it">
    <head></head>
    <body>{children}</body>
  </html>
);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
export default RootLayout;
