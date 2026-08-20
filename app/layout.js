'use client';

import Nav from './nav';

let renders = 0;

export default function RootLayout({ children }) {
  renders++;
  console.log('RootLayout render #' + renders);
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
