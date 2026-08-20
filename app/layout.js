import Link from 'next/link';

export default function RootLayout({ children, slot }) {
  return (
    <html lang="en">
      <body>
        <Link href="/">/</Link> | <Link href="/page/one">/page/one</Link>
        <div id="children" style={{ border: '1px solid red', padding: 8 }}>
          <b>children slot:</b>
          {children}
        </div>
        <div id="slot" style={{ border: '1px solid blue', padding: 8 }}>
          <b>@slot:</b>
          {slot}
        </div>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
